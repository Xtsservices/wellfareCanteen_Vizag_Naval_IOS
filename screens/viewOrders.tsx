import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  NativeModules,
  Image,
} from 'react-native';
import DownNavbar from './downNavbar';
import Header from './header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { API_BASE_URL } from './services/restApi';
import ViewShot from 'react-native-view-shot';
// const logo = require('./imgs/worldtek.png');
const logo = require('./imgs/worldtek.png')

const ViewOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [cancellingOrders, setCancellingOrders] = useState<Set<number>>(
    new Set(),
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [canteenName, setCanteenName] = useState<string>('Welfare Canteen');
  // Store refs for each QR code, keyed by order ID
  const qrRefs = useRef<{ [key: number]: any }>({});
  const viewShotRefs = useRef<{ [key: number]: any }>({});

  const { SaveImageModule } = NativeModules;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('authorization');
        const storedCanteenName = await AsyncStorage.getItem('canteenName');
        if (storedCanteenName) {
          setCanteenName(storedCanteenName);
        }
        
        const response = await axios.get(`${API_BASE_URL}/order/listOrders`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token || '',
          },
        });
        if (response?.data?.data) {
          const ordersWithQR = response.data.data.map((order: any) => ({
            ...order,
            qrValue: `https://server.welfarecanteen.in/api/order/${order.id}`
          }));
          setOrders(ordersWithQR);
        }
      } catch (error: any) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const formatDateForQR = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTimeForQR = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isRecentOrder = (timestamp: number) => {
    const orderDate = new Date(timestamp * 1000);
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    return orderDate > fortyEightHoursAgo;
  };

  const canCancelOrder = (status: string) => {
    return status.toLowerCase() !== 'cancelled';
  };

  const cancelOrder = async (orderId: number, currentStatus: string) => {
    if (currentStatus.toLowerCase() === 'cancelled') {
      Alert.alert('Info', 'This order has already been cancelled.');
      return;
    }

    Alert.alert(
      'Cancel Order',
      `Are you sure you want to cancel this order?\n\nOrder Status: ${currentStatus.toUpperCase()}\n\nNote: Cancelled orders cannot be undone.`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancellingOrders(prev => new Set(prev).add(orderId));
              const token = await AsyncStorage.getItem('authorization');
              console.log('Cancelling order with ID:', orderId);
              const response = await axios.post(
                `${API_BASE_URL}/order/cancelOrder`,
                { orderId },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    authorization: token || '',
                  },
                },
              );

              setOrders(prevOrders =>
                prevOrders.map(order =>
                  order.id === orderId
                    ? { ...order, status: 'cancelled' }
                    : order,
                ),
              );
              Alert.alert('Success', 'Order cancelled successfully');
            } catch (error: any) {
              let errorMessage = 'Failed to cancel order';
              if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              } else if (error.message) {
                errorMessage = error.message;
              }
              Alert.alert('Error', errorMessage);
            } finally {
              setCancellingOrders(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
              });
            }
          },
        },
      ],
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      case 'pending':
        return '#FF9800';
      case 'confirmed':
        return '#2196F3';
      default:
        return '#FF9800';
    }
  };

  const handleDownload = async (orderId: number) => {
    try {
      const viewShotRef = viewShotRefs.current[orderId];

      if (!viewShotRef) {
        Alert.alert('Error', 'QR code reference not found');
        return;
      }

      // Capture the entire QR frame as image
      const uri = await viewShotRef.capture();
      
      // Convert to base64 and save
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64data = reader.result as string;
          const cleanBase64 = base64data.replace(/^data:image\/png;base64,/, '');
          
          const res = await SaveImageModule.saveBase64Image(
            cleanBase64,
            `QRCode_${orderId}_${Date.now()}`
          );
          console.log(res);
          Alert.alert('Success', 'QR code saved to gallery!');
        } catch (e: any) {
          console.log(e);
          Alert.alert('Error', e?.message || 'Failed to save QR');
        }
      };
      
      reader.readAsDataURL(blob);
    } catch (e: any) {
      console.log('Error in handleDownload', e);
      Alert.alert('Error', e?.message || 'Unknown error');
    }
  };

  const renderOrder = ({ item }: { item: any }) => {
    const isCancelled = item.status.toLowerCase() === 'cancelled';
    const strikeThroughStyle = isCancelled
      ? { textDecorationLine: 'line-through' as 'line-through', color: '#888' }
      : {};

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={[styles.orderId, strikeThroughStyle]}>
            Order #{item.id}
          </Text>
          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.date, strikeThroughStyle]}>
          {formatDateTime(item.createdAt)}
        </Text>
        <View style={styles.amountRow}>
          <Text style={[styles.amountLabel, strikeThroughStyle]}>Total:</Text>
          <Text style={[styles.amountValue, strikeThroughStyle]}>
            ₹{item.totalAmount}
          </Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={[styles.paymentLabel, strikeThroughStyle]}>
            Payment:
          </Text>
          <Text style={[styles.paymentValue, strikeThroughStyle]}>
            {item.payment?.status} via {item.payment?.paymentMethod}
          </Text>
        </View>
        <Text style={[styles.itemsTitle, strikeThroughStyle]}>Items:</Text>
        <View style={styles.itemsList}>
          {item.orderItems.map((orderItem: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Text style={[styles.itemName, strikeThroughStyle]}>
                {orderItem.menuItemItem.name}
              </Text>
              <Text style={[styles.itemQty, strikeThroughStyle]}>
                × {orderItem.quantity}
              </Text>
            </View>
          ))}
        </View>
        {canCancelOrder(item.status) &&
          !isCancelled &&
          item.status.toUpperCase() !== 'CANCELED' &&
          item.status.toUpperCase() !== 'INITIATED' &&
          item.status.toUpperCase() !== 'COMPLETED' && (
            <TouchableOpacity
              style={[
                styles.cancelButton,
                cancellingOrders.has(item.id) && styles.cancelButtonDisabled,
              ]}
              onPress={() => cancelOrder(item.id, item.status)}
              disabled={cancellingOrders.has(item.id)}>
              <Text style={styles.cancelButtonText}>
                {cancellingOrders.has(item.id)
                  ? 'Cancelling...'
                  : 'Cancel Order'}
              </Text>
            </TouchableOpacity>
          )}
        {isCancelled && (
          <View style={styles.cancelledContainer}>
            <Text style={styles.cancelledText}>
              This order has been cancelled
            </Text>
          </View>
        )}
        {item.qrValue &&
          isRecentOrder(item.createdAt) &&
          !isCancelled &&
          item.status.toUpperCase() !== 'CANCELED' &&
          item.status.toUpperCase() !== 'INITIATED' &&
          item.status.toUpperCase() !== 'COMPLETED' && (
            <TouchableOpacity
              style={styles.qrContainer}
              activeOpacity={0.8}
              onPress={() => handleDownload(item.id)}
            >
              <ViewShot 
                ref={(ref) => (viewShotRefs.current[item.id] = ref)}
                options={{ format: "png", quality: 1.0 }}
                style={styles.qrFrame}
              >
                {/* Header Section */}
                <View style={styles.qrFrameHeader}>
                  <Text style={styles.qrFrameTitle}>
                    {item?.orderCanteen?.canteenName || 'Welfare Canteen'}
                  </Text>
                </View>
                
                {/* QR Code Section */}
                <View style={styles.qrCodeSection}>
                  <View style={styles.qrCodeWrapper}>
                    <QRCode
                      value={item.qrValue}
                      size={120}
                      backgroundColor="#FFFFFF"
                      color="#000000"
                      getRef={(c) => (qrRefs.current[item.id] = c)}
                    />
                  </View>
                </View>
                
                {/* Footer Section */}
                <View style={styles.qrFrameFooter}>
                  <View style={styles.qrInfoRow}>
                    <Text style={styles.qrInfoLabel}>Order ID:</Text>
                    <Text style={styles.qrInfoValue}>#{item.id}</Text>
                  </View>
                  <View style={styles.qrInfoRow}>
                    <Text style={styles.qrInfoLabel}>Booked For:</Text>
                    {/* this chnages need to check in after playstore */}
                    <Text style={styles.qrInfoValue}>{formatDateForQR(item.orderDate)}</Text>
                  </View>
                  <View style={styles.qrInfoRow}>
                    <Text style={styles.qrInfoLabel}>Booked Time:</Text>
                    <Text style={styles.qrInfoValue}>{formatTimeForQR(item.createdAt)}</Text>
                  </View>
                  <View style={styles.qrInfoRow}>
                    <Text style={styles.qrInfoLabel}>Amount:</Text>
                    <Text style={styles.qrInfoValueAmount}>₹{item.totalAmount}</Text>
                  </View>
                </View>
                {/* Bottom Brand */}
                <View style={styles.qrBrandSection}>
                  <Text style={styles.qrBrandText}>Powered by </Text>
                  <Image
            source={logo}
            style={styles.poweredByLogo}
            resizeMode="contain"
          />
                </View>
              </ViewShot>
              <Text style={styles.qrDownloadText}>Tap to Download QR Receipt</Text>
            </TouchableOpacity>
          )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header text="Orders History" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id.toString()}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <DownNavbar style={styles.stckyNavbar} />
    </View>
  );
};

// Constants
const COLORS = {
  PRIMARY: '#0014A8',
  TEXT_DARK: '#333',
  TEXT_SECONDARY: '#888',
  BACKGROUND: '#F3F6FB',
  BORDER: '#e0e0e0',
  CANCELLED: '#F44336',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
   poweredByLogo: {
    width: 120,
    height: 35,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: wp('4%'),
    paddingBottom: hp('12%'),
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    padding: wp('4.5%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: wp('2%'),
    shadowOffset: { width: 0, height: hp('0.2%') },
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  orderId: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  status: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
  },
  date: {
    fontSize: wp('3.2%'),
    color: COLORS.TEXT_SECONDARY,
    marginBottom: hp('1%'),
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('0.2%'),
  },
  amountLabel: {
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
  },
  amountValue: {
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  paymentLabel: {
    color: COLORS.TEXT_SECONDARY,
  },
  paymentValue: {
    color: COLORS.TEXT_SECONDARY,
  },
  itemsTitle: {
    fontWeight: 'bold',
    marginTop: hp('1%'),
    marginBottom: hp('0.2%'),
    color: COLORS.PRIMARY,
  },
  itemsList: {
    marginBottom: hp('1.2%'),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('0.2%'),
  },
  itemName: {
    flex: 2,
    color: COLORS.TEXT_DARK,
  },
  itemQty: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.TEXT_SECONDARY,
  },
  cancelButton: {
    backgroundColor: COLORS.CANCELLED,
    paddingVertical: hp('1.2%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
  },
  cancelButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  cancelButtonText: {
    fontSize: wp('3.8%'),
    color: '#fff',
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: hp('1.5%'),
  },
  qrFrame: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
    shadowOffset: { width: 0, height: hp('0.2%') },
    elevation: 5,
    width: wp('70%'),
  },
  qrFrameHeader: {
    alignItems: 'center',
    marginBottom: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: hp('1%'),
  },
  qrFrameTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'center',
  },
  qrFrameSubtitle: {
    fontSize: wp('3%'),
    color: COLORS.TEXT_SECONDARY,
    marginTop: hp('0.2%'),
  },
  qrCodeSection: {
    alignItems: 'center',
    marginVertical: hp('1.5%'),
  },
  qrCodeWrapper: {
    backgroundColor: '#FFFFFF',
    padding: wp('2%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  qrFrameFooter: {
    marginTop: hp('1.5%'),
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: hp('1%'),
  },
  qrInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  qrInfoLabel: {
    fontSize: wp('3%'),
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  qrInfoValue: {
    fontSize: wp('3%'),
    color: COLORS.TEXT_DARK,
    fontWeight: '600',
  },
  qrInfoValueAmount: {
    fontSize: wp('3.2%'),
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  qrBrandSection: {
    alignItems: 'center',
    marginTop: hp('1%'),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: hp('0.8%'),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp('1%'),
  },
  qrBrandText: {
    fontSize: wp('2.5%'),
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  qrDownloadText: {
    marginTop: hp('1%'),
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    fontSize: wp('3.2%'),
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.TEXT_SECONDARY,
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  cancelledContainer: {
    backgroundColor: '#FFEBEE',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('1%'),
    borderWidth: wp('0.2%'),
    borderColor: '#FFCDD2',
  },
  cancelledText: {
    fontSize: wp('3.5%'),
    color: COLORS.CANCELLED,
    fontWeight: '600',
  },
  stckyNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: hp('1.2%'),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: wp('0.2%'),
    borderTopColor: COLORS.BORDER,
  },
});

export default ViewOrders;