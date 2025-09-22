import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from './header';
import DownNavbar from './downNavbar';
import {API_BASE_URL} from './services/restApi';
import {CFEnvironment, CFSession} from 'cashfree-pg-api-contract';
import {
  CFPaymentGatewayService,
  CFErrorResponse,
} from 'react-native-cashfree-pg-sdk';
import {useSelector} from 'react-redux';
import {AppState} from '../store/storeTypes';

// Constants
const COLORS = {
  PRIMARY: '#0014A8',
  ERROR: '#ff4d4d',
  TEXT_SECONDARY: '#666',
  TEXT_DARK: '#222',
  TEXT_LIGHT: '#888',
  BACKGROUND: '#F4F6FB',
  CARD: '#fff',
  BORDER: '#e6eaf2',
};

// Type Definitions
type RootStackParamList = {
  CartPage: undefined;
  PaymentMethod: undefined;
  ViewOrders: undefined;
  Splash: undefined;
  PaymentStatusScreen: {
    status: 'success' | 'failure';
    orderData?: any;
    error?: CFErrorResponse;
  };
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  replace: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  addListener: (event: string, callback: (e: any) => void) => () => void;
};

const PaymentMethod: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [orderResponse, setOrderResponse] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const checkoutTotalBalance = useSelector(
    (state: AppState) => state.checkoutTotalBalance,
  );

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (showOrderDetails) {
        navigation.navigate('ViewOrders');
        return true;
      }
      if (loading) {
        return true;
      }
      if (navigation.canGoBack()) {
        navigation.navigate('CartPage');
        return true;
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (loading || showOrderDetails) {
        e.preventDefault();
        backAction();
      }
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation, loading, showOrderDetails]);

  // Set up Cashfree callback
  useEffect(() => {
    // Fetch wallet balance on mount
    fetchWalletData();

    CFPaymentGatewayService.setCallback({
      onVerify: (orderID: string) => {
        console.log('✅ Order verified:', orderID);
        Toast.show({
          type: 'success',
          text1: `Payment Verified: ${orderID}`,
        });
        // Navigate to PaymentStatusScreen with success status
        console.log('PaymentStatusScreen===========');

        navigation.navigate('PaymentStatusScreen', {
          status: 'success',
          orderData: {id: orderID},
        });
      },
      onError: (error: CFErrorResponse, orderID: string) => {
        console.log('❌ Payment Error:', error, orderID);
        Toast.show({
          type: 'error',
          text1: `Payment Failed`,
          text2: `Order ID: ${orderID}`,
        });
        setLoading(false);
        // Navigate to PaymentStatusScreen with failure status
        navigation.replace('PaymentStatusScreen', {
          status: 'failure',
          orderData: {id: orderID},
          error,
        });
      },
    });

    return () => {
      CFPaymentGatewayService.removeCallback();
    };
  }, [navigation]);

  const fetchWalletData = async () => {
    try {
      const token = await AsyncStorage.getItem('authorization');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: token,
      };

      const [balanceRes] = await Promise.all([
        fetch(`${API_BASE_URL}/order/getWalletBalance`, {headers}),
      ]);

      if (!balanceRes.ok) {
        console.error('Failed to fetch wallet data');
        return;
      }

      const balanceJson = await balanceRes.json();

      setWalletBalance(balanceJson.data.walletBalance || 0);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  // Handle payment with Cashfree SDK or cash
  const handlePayment = useCallback(async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authorization');
      const phoneNumber =   await AsyncStorage.getItem('phoneNumber');

      if (!token) {
        Alert.alert('Error', 'No token found');
        setLoading(false);
        return;
      }

      // wallet payment if cash then check wallet balance
      console.log('walletBalance0', walletBalance);
      console.log('checkoutTotalBalance2', checkoutTotalBalance);
      console.log(
        'walletBalance > checkoutTotalBalance',
        walletBalance > checkoutTotalBalance,
      );

      if (selectedMethod === 'wallet') {
        //it should be less than  to wallet balance
        if (checkoutTotalBalance && walletBalance < checkoutTotalBalance) {
          Alert.alert(
            'Insufficient Wallet Balance',
            'Please proceed with UPI payment.',
          );
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/order/placeOrder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
          body: JSON.stringify({paymentMethod: ['wallet']}),
        });
        const data = await response.json();
        if (response.ok && data.data) {
          setOrderResponse(data.data);
          setShowOrderDetails(true);
          Alert.alert('Success', 'Order Placed Successfully');
          // Navigate to PaymentStatusScreen for cash payment
          navigation.replace('PaymentStatusScreen', {
            status: 'success',
            orderData: data.data,
          });
        } else {
          Alert.alert('Error', data.message || 'Failed to place order.');
        }
        setLoading(false);
        return;
      }

      console.log("checkoutTotalBalance",checkoutTotalBalance)
      console.log("token",token)
      // Online payment via Cashfree SDK
      const userData = {
        customer_id: 'user_001', // TODO: Replace with actual user ID
        customer_email: 'testuser@example.com',
        customer_phone: phoneNumber,
        order_amount:checkoutTotalBalance
      };

      const response = await axios.post(
        `${API_BASE_URL}/paymentsdk/createOrder`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        },
      );

      console.log("paymentresponse",response.data)

      const {payment_session_id, order_id} = response.data;

      if (!payment_session_id || !order_id) {
        throw new Error('Missing payment_session_id or order_id');
      }

      const session = new CFSession(
        payment_session_id,
        order_id,
        CFEnvironment.PRODUCTION, // TODO: Use CFEnvironment.PRODUCTION in production
      );

      console.log('⚡ Initiating Web Checkout with session:', session);

      CFPaymentGatewayService.doWebPayment(session);

      Toast.show({
        type: 'success',
        text1: 'Payment page opened',
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: error.message || 'Something went wrong',
      });
      setLoading(false);
      setSelectedMethod('');
    }
  }, [selectedMethod, navigation]);

  const handleOrderDetails = useCallback(() => {
    navigation.navigate('ViewOrders');
  }, [navigation]);

  // Reset state when payment method changes
  useEffect(() => {
    setOrderResponse(null);
    setShowOrderDetails(false);
  }, [selectedMethod]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header text="Processing Payment" />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
        <DownNavbar />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        text={orderResponse ? 'Order Details' : 'Choose Payment Method'}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!orderResponse ? (
          <>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedMethod === 'online' && styles.optionSelected,
                ]}
                onPress={() => setSelectedMethod('online')}>
                <Image
                  source={{
                    uri: 'https://cdn.zeebiz.com/sites/default/files/2024/01/03/274966-upigpay.jpg',
                  }}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>UPI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedMethod === 'wallet' && styles.optionSelected,
                ]}
                onPress={() => setSelectedMethod('wallet')}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/2331/2331940.png',
                  }}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>WC-Wallet</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.payButton,
                {opacity: loading || !selectedMethod ? 0.5 : 1},
              ]}
              onPress={handlePayment}
              disabled={loading || !selectedMethod}>
              <Text style={styles.payButtonText}>
                {loading ? 'Processing...' : 'Pay Now'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.orderDetailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID:</Text>
              <Text style={styles.detailValue}>{orderResponse.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Amount:</Text>
              <Text style={styles.detailValue}>
                ₹{orderResponse.totalAmount}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={styles.detailValue}>{orderResponse.status}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Remaining Amount:</Text>
              <Text style={styles.detailValue}>
                ₹{orderResponse.payments?.remainingAmount || 0}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Wallet Payment:</Text>
              <Text style={styles.detailValue}>
                ₹{orderResponse.payments?.walletPaymentAmount || 0}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.orderDetailsButton}
              onPress={handleOrderDetails}>
              <Text style={styles.orderDetailsButtonText}>View All Orders</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <DownNavbar />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    paddingBottom: hp('10%'),
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: hp('4%'),
  },
  option: {
    backgroundColor: COLORS.CARD,
    borderRadius: wp('2%'),
    padding: wp('3%'),
    margin: wp('2%'),
    width: wp('40%'),
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {width: 0, height: hp('0.2%')},
    shadowOpacity: 0.08,
    shadowRadius: wp('1%'),
  },
  optionSelected: {
    borderColor: COLORS.PRIMARY,
    borderWidth: wp('0.5%'),
    backgroundColor: '#e6eaff',
  },
  optionIcon: {
    width: wp('12%'),
    height: wp('12%'),
    resizeMode: 'contain',
    marginBottom: hp('1%'),
  },
  optionText: {
    color: COLORS.TEXT_DARK,
    fontSize: wp('3.8%'),
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: wp('2%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    marginHorizontal: wp('4%'),
    marginVertical: hp('1%'),
    elevation: 2,
  },
  payButtonText: {
    color: COLORS.CARD,
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  orderDetailsContainer: {
    backgroundColor: COLORS.CARD,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginVertical: hp('2%'),
    elevation: 2,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {width: 0, height: hp('0.2%')},
    shadowOpacity: 0.08,
    shadowRadius: wp('1.5%'),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  detailLabel: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    flex: 1,
  },
  detailValue: {
    fontSize: wp('3.8%'),
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
    textAlign: 'right',
  },
  orderDetailsButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: wp('2%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  orderDetailsButtonText: {
    color: COLORS.CARD,
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  loadingText: {
    color: COLORS.TEXT_DARK,
    fontSize: wp('4%'),
    marginTop: hp('2%'),
  },
});

export default PaymentMethod;
