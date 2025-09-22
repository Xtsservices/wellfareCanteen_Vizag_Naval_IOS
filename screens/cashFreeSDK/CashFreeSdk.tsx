import React, { useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Cashfree imports (✅ use correct modules)
import {
  CFEnvironment,
  CFSession,
} from 'cashfree-pg-api-contract';
import {
  CFPaymentGatewayService,
  CFErrorResponse,
} from 'react-native-cashfree-pg-sdk';
import { API_BASE_URL } from '../services/restApi';

const PaymentScreen: React.FC = () => {

  useEffect(() => {
    // ✅ Set callback when component mounts
    CFPaymentGatewayService.setCallback({
      onVerify(orderID: string): void {
        console.log('✅ Order verified:', orderID);
        Toast.show({
          type: 'success',
          text1: `Payment Verified: ${orderID}`,
        });
      },
      onError(error: CFErrorResponse, orderID: string): void {
        console.log('❌ Payment Error:', error, orderID);
        Toast.show({
          type: 'error',
          text1: `Payment Failed`,
          text2: `Order ID: ${orderID}`,
        });
      },
    });

    return () => {
      // ✅ Clean up callback
      CFPaymentGatewayService.removeCallback();
    };
  }, []);

  const handlePayment = async (): Promise<void> => {
    try {
      console.log('Starting payment process...');
// const URL = 'http://192.168.1.22:3002/api';
        // `${API_BASE_URL}/paymentsdk/createOrder`,
      const phoneNumber =   await AsyncStorage.getItem('phoneNumber');


      const response = await axios.post(
        `${API_BASE_URL}/paymentsdk/createOrder`,
        {
          customer_id: 'user_001',
          customer_email: 'testuser@example.com',
          customer_phone: phoneNumber,
        }
      );

      const { payment_session_id, order_id } = response.data;

      if (!payment_session_id || !order_id) {
        throw new Error('Missing payment_session_id or order_id');
      }

      const session = new CFSession(
        payment_session_id,
        order_id,
        CFEnvironment.PRODUCTION 
      );

      console.log('⚡ Initiating Web Checkout with session:', session);

      // ✅ Trigger payment
      CFPaymentGatewayService.doWebPayment(session);

      Toast.show({
        type: 'success',
        text1: 'Payment page opened',
      });

    } catch (error: any) {
      console.error('Error during payment:', error);
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: error.message || 'Something went wrong',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pay Now (Web Checkout)" onPress={handlePayment} />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentScreen;
