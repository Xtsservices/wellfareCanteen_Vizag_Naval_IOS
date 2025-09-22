import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from './navigationTypes';
import NetInfo from '@react-native-community/netinfo';
import { AllCanteens } from './services/restApi';

const CheckUserLogin = ({ navigation }: { navigation: NavigationProp<RootStackParamList> }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Checking Authentication, Please Wait...');

  const fetchCanteens = async () => {
    try {
      setLoading(true);
      setMessage('Checking Authentication, Please Wait...');
      
      const token = await AsyncStorage.getItem('authorization');
      if (!token) {
        setMessage('No Authentication Found, Please Wait...');
        setTimeout(() => {
          setLoading(false);
          navigation.replace('Login');
        }, 2000);
        return;
      }

      setMessage('Verifying Network Connection, Please Wait...');
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        setMessage('No Internet Connection, Please Wait...');
        setTimeout(() => {
          setLoading(false);
          navigation.replace('Login');
        }, 2000);
        return;
      }

      setMessage('Loading Canteen Data, Please Wait...');
      const response = await axios.get(AllCanteens(), {
        headers: { Authorization: token },
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        setMessage('Authentication Successful, Please Wait...');
        setTimeout(() => {
          navigation.replace('SelectCanteen');
        }, 1500);
      } else {
        setMessage('No Canteens Available, Please Wait...');
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
      }
    } catch (error) {
      console.error('Error fetching canteens:', error);
      setMessage('Authentication Failed, Please Wait...');
      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  };

  useEffect(() => {
    fetchCanteens();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* App Title */}
        <Text style={styles.appTitle}>Welfare Canteen</Text>

        {/* Loading Section */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={styles.messageText}>
              {message}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 40,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 20,
    lineHeight: 24,
  },
});

export default CheckUserLogin;
