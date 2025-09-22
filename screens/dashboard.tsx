import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes';
import axios from 'axios';
import { GetMenuItemsbyCanteenId } from './services/restApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './header';
import DownNavbar from './downNavbar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Note: Ensure react-native-responsive-screen is installed:
// 1. Run `npm install react-native-responsive-screen`
// 2. Ensure Header.tsx uses PNGs (wallet.png, profile.png) in src/assets/
// 3. Rebuild: `npx react-native run-android` or `npx react-native run-ios`
// 4. If images don't render, verify paths and clear cache: `npx react-native start --reset-cache`

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardProps {
  navigation: DashboardScreenNavigationProp;
  route: {
    params: {
      canteenId: string;
    };
  };
}

const Dashboard: React.FC<DashboardProps> = ({ navigation, route }) => {
  const [menuData, setMenuData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { canteenId } = route.params;
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        let validCanteenId = canteenId || (await AsyncStorage.getItem('canteenId')) || '';
        if (!validCanteenId) {
          console.error('No canteenId available');
          return;
        }
        await AsyncStorage.setItem('canteenId', validCanteenId);

        const token = await AsyncStorage.getItem('authorization');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get(GetMenuItemsbyCanteenId(validCanteenId), {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        });
          console.log("response.data.data",response.data.data);

        setMenuData(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error) && error.response?.status === 500) {
          Alert.alert('Error', 'Failed to load menu data. Please try again later.');
        }
      }
    };

    fetchMenuData();
  }, [canteenId]);

  const renderMenuItems = (date: string, menu: any) => (
    <View key={date} style={styles.menuSection}>
      <Text style={styles.menuDate}>{date}</Text>
      <View style={styles.menuRow}>
        {Object.keys(menu).map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            onPress={async () => {
              const menuItem = menu[category][0];
              if (menuItem) {
                setSelectedDate(date);
                await AsyncStorage.setItem('selectedDate', date);
                navigation.navigate('MenubyMenuId', {
                  menuId: menuItem.id,
                  date,
                });
              }
            }}
          >
            <Image
              source={{
                uri:
                  category === 'Breakfast'
                    ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
                    : category === 'Lunch'
                    ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'
                    : category === 'Snack'
                    ? 'https://wallpapers.com/images/high/assorted-snack-products-display-jq5cfglivdr8d6t6-jq5cfglivdr8d6t6.png'
                    : 'https://via.placeholder.com/150',
              }}
              style={styles.menuImage}
            />
            <Text style={styles.menuCategory}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

    if (loading) {
      return (
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#0014A8" />
        </View>
      );
    }

  return (
    <View style={styles.container}>
      <Header text="Dashboard" />
      {/* <View style={styles.searchBar}>
        <Image
          source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/search--v1.png' }}
          style={styles.searchIcon}
        />
        <TextInput placeholder="Search..." style={styles.searchInput} />
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/microphone.png' }}
            style={styles.micIcon}
          />
        </TouchableOpacity>
      </View> */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {menuData && Object.keys(menuData).length > 0 ? (
          Object.keys(menuData).map((date) => renderMenuItems(date, menuData[date]))
        ) : (
          <Text style={styles.noDataText}>No menu data available.</Text>
        )}
      </ScrollView>
      <DownNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    marginHorizontal: wp('4%'),
    marginBottom: hp('1%'),
    marginTop: hp('1%'),
    paddingHorizontal: wp('3%'),
    elevation: 2,
  },
  searchIcon: {
    width: wp('5%'),
    height: wp('5%'),
    tintColor: '#0014A8',
    marginRight: wp('2%'),
  },
  searchInput: {
    flex: 1,
    height: hp('6%'),
    fontSize: wp('4%'),
    color: '#222',
  },
  micIcon: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    tintColor: '#0014A8',
    marginLeft: wp('2%'),
  },
  scrollContent: {
    paddingBottom: hp('10%'),
  },
  menuSection: {
    marginHorizontal: wp('4%'),
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
    backgroundColor: '#fff',
    borderRadius: wp('3.5%'),
    padding: wp('3.5%'),
    elevation: 2,
  },
  menuDate: {
    color: '#0014A8',
    fontSize: wp('3.8%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    letterSpacing: wp('0.1%'),
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: wp('25%'),
    alignItems: 'center',
    backgroundColor: '#F6F8FB',
    borderRadius: wp('2.5%'),
    padding: wp('2%'),
    marginHorizontal: wp('1%'),
    elevation: 1,
  },
  menuImage: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
    backgroundColor: '#eee',
  },
  menuCategory: {
    color: '#0014A8',
    fontWeight: '600',
    fontSize: wp('3.5%'),
    textAlign: 'center',
  },
  noDataText: {
    color: '#aaa',
    fontSize: wp('4%'),
    marginTop: hp('7%'),
    textAlign: 'center',
  },
});

export default Dashboard;