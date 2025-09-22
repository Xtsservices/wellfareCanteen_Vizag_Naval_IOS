import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Image,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenParams } from './menu/types';
import { API_BASE_URL } from '../services/restApi';

type AdminDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminDashboard'
>;

interface DashboardData {
  totalOrders: number;
  totalAmount: number;
  completedOrders: number;
  cancelledOrders: number;
  totalItems: number;
  totalCanteens: number;
  totalMenus: number;
}

const AdminDashboard = () => {
  const navigation = useNavigation<AdminDashboardNavigationProp>();
  const route = useRoute();
  const { width, height } = useWindowDimensions();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem('authorization');
      const response = await fetch(`${API_BASE_URL}/adminDasboard/dashboard`, {
        headers: {
          'Authorization': token || '',
        },
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params) {
        loadData();
      }
    });

    loadData();
    return unsubscribe;
  }, [navigation, route.params]);

  const cardSize = Math.min(width * 0.6, height * 0.6);
  const isPortrait = height >= width;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Restaurant Dashboard</Text>
        <TouchableOpacity
          style={styles.usersButton}
          onPress={() => navigation.navigate('Users', { newUser: undefined })}
        >
          <Text style={styles.usersButtonText}>Users</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
          />
        }
      >
        {/* Stats Overview */}
        {dashboardData && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{dashboardData.totalOrders}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₹{dashboardData.totalAmount}</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{dashboardData.completedOrders}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        )}

        {/* Main Content */}
        <View style={styles.centerContainer}>
          <View style={[styles.middleRow, isPortrait && styles.middleColumn]}>
            {/* QR Scan Card */}
            <TouchableOpacity
              style={[
                styles.squareCard,
                {
                  width: cardSize,
                  height: cardSize,
                  marginRight: isPortrait ? 0 : 20,
                  marginBottom: isPortrait ? 20 : 0,
                },
              ]}
              onPress={() => navigation.navigate('BluetoothControl')}
            >
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/1122528/pexels-photo-1122528.jpeg',
                }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Quick Scan</Text>
                <Text style={styles.cardDescription}>Scan QR Code</Text>
              </View>
            </TouchableOpacity>

            {/* Walk-ins Card */}
            <TouchableOpacity
              style={[
                styles.squareCard,
                {
                  width: cardSize,
                  height: cardSize,
                },
              ]}
              onPress={() => navigation.navigate('Walkin')}
            >
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/4253320/pexels-photo-4253320.jpeg',
                }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Walk-ins</Text>
                <Text style={styles.cardDescription}>Manage customers</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Orders Counter */}
      <TouchableOpacity
        style={styles.ordersCounter}
        onPress={() => navigation.navigate({ name: 'OrderDetails', params: { orderId: '12345' } })}
        >
        <Text style={styles.ordersCounterText}>
          Orders: {dashboardData?.totalOrders || 0}
        </Text>
        <Text style={styles.ordersCounterSubtext}>
          ₹{dashboardData?.totalAmount || 0} total
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1a237e',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 5,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  usersButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  usersButtonText: {
    color: '#1a237e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    marginBottom: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  squareCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease-in-out',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  cardImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: '30%',
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  ordersCounter: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1a237e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
      default: {
        elevation: 5,
      },
    }),
  },
  ordersCounterText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ordersCounterSubtext: {
    color: '#e8eaf6',
    fontSize: 14,
    marginTop: 5,
  },
});

export default AdminDashboard;