import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from './header';
import DownNavbar from './downNavbar';
import { API_BASE_URL } from './services/restApi';

const COLORS = {
  PRIMARY: '#28a745', // success green
  ERROR: '#dc3545', // failure red
  BACKGROUND: '#f4f6fb',
  CARD: '#fff',
  TEXT_DARK: '#222',
  TEXT_SECONDARY: '#666',
};

const PaymentStatusScreen = ({ navigation, route }) => {
  const { orderData, error } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'failure'>('idle');

  useEffect(() => {
    const placeOrder = async () => {
      try {
        setLoading(true);
        setStatus('loading');

        const token = await AsyncStorage.getItem('authorization');
        if (!token) return;

        const orderId = orderData?.id;

        const response = await fetch(`${API_BASE_URL}/order/placeOrder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
          body: JSON.stringify({
            paymentMethod: ['online'],
            platform: 'mobile',
            orderId,
          }),
        });

        const data = await response.json();

        if (data?.data) {
          setStatus('success');
          await AsyncStorage.removeItem('guestCart');
          await AsyncStorage.removeItem('selectedDate');
          navigation.replace('ViewOrders');
        } else {
          const errMsg = data.errors?.[0] || 'Order placement failed';
          Alert.alert('Error', errMsg);
          setStatus('failure');
        }
      } catch (err) {
        console.error('Order placement failed:', err);
        Alert.alert('Error', 'Something went wrong. Please try again.');
        setStatus('failure');
      } finally {
        setLoading(false);
      }
    };

    if (orderData) {
      placeOrder();
    }
  }, [orderData, navigation]);

  useEffect(() => {
    const backAction = () => true; // block hardware back
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const handleContinue = () => navigation.replace('ViewOrders');
  const handleRetry = () => navigation.replace('PaymentMethod');

  return (
    <View style={styles.container}>
      <Header text={status === 'success' ? 'Payment Successful' : 'Payment Failed'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusCard}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.PRIMARY} />
              <Text style={styles.loadingText}>Placing your order...</Text>
            </View>
          ) : (
            <>
              <Image
                source={{
                  uri:
                    status === 'success'
                      ? 'https://cdn-icons-png.flaticon.com/512/190/190411.png'
                      : 'https://cdn-icons-png.flaticon.com/512/1828/1828666.png',
                }}
                style={styles.statusIcon}
              />
              <Text style={[styles.statusTitle, { color: status === 'success' ? COLORS.PRIMARY : COLORS.ERROR }]}>
                {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
              </Text>
              <Text style={styles.statusMessage}>
                {status === 'success'
                  ? 'Your payment has been processed successfully.'
                  : error?.message || 'Something went wrong. Please try again.'}
              </Text>

              {orderData && (
                <View style={styles.orderDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Order ID:</Text>
                    <Text style={styles.detailValue}>{orderData.id}</Text>
                  </View>
                  {orderData.totalAmount && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Total Amount:</Text>
                      <Text style={styles.detailValue}>₹{orderData.totalAmount}</Text>
                    </View>
                  )}
                  {orderData.status && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status:</Text>
                      <Text style={styles.detailValue}>{orderData.status}</Text>
                    </View>
                  )}
                  {orderData.payments?.remainingAmount !== undefined && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Remaining Amount:</Text>
                      <Text style={styles.detailValue}>₹{orderData.payments.remainingAmount}</Text>
                    </View>
                  )}
                  {orderData.payments?.walletPaymentAmount !== undefined && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Wallet Payment:</Text>
                      <Text style={styles.detailValue}>₹{orderData.payments.walletPaymentAmount}</Text>
                    </View>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: status === 'success' ? COLORS.PRIMARY : COLORS.ERROR },
                ]}
                onPress={status === 'success' ? handleContinue : handleRetry}>
                <Text style={styles.actionButtonText}>
                  {status === 'success' ? 'View Order' : 'Retry Payment'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
      <DownNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  scrollContent: { flexGrow: 1, padding: wp('4%'), paddingBottom: hp('10%') },
  statusCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: wp('3%'),
    padding: wp('5%'),
    marginVertical: hp('3%'),
    alignItems: 'center',
    shadowColor: COLORS.TEXT_DARK,
    shadowOffset: { width: 0, height: hp('0.3%') },
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
    elevation: 3,
  },
  loaderContainer: { alignItems: 'center', paddingVertical: hp('5%') },
  loadingText: { marginTop: hp('2%'), fontSize: wp('4%'), color: COLORS.TEXT_SECONDARY },
  statusIcon: { width: wp('25%'), height: wp('25%'), resizeMode: 'contain', marginBottom: hp('2%') },
  statusTitle: { fontSize: wp('5%'), fontWeight: '700', marginBottom: hp('1%') },
  statusMessage: { fontSize: wp('4%'), color: COLORS.TEXT_SECONDARY, textAlign: 'center', marginBottom: hp('3%') },
  orderDetails: { width: '100%', marginBottom: hp('3%') },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('1%') },
  detailLabel: { fontSize: wp('3.8%'), fontWeight: '600', color: COLORS.TEXT_DARK, flex: 1 },
  detailValue: { fontSize: wp('3.8%'), color: COLORS.TEXT_SECONDARY, flex: 1, textAlign: 'right' },
  actionButton: { borderRadius: wp('2%'), paddingVertical: hp('1.8%'), alignItems: 'center', width: '100%', elevation: 2 },
  actionButtonText: { color: COLORS.CARD, fontSize: wp('4.2%'), fontWeight: '700' },
});

export default PaymentStatusScreen;
