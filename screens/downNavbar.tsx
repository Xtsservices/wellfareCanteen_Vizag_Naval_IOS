import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { AppState } from '../store/storeTypes';
import { fetchCartData } from './services/cartHelpers';
import { dispatch } from '../store/store';

// Define your stack's routes
type RootStackParamList = {
  Dashboard: { SelectCanteenId: string };
  CartPage: undefined;
  ViewOrders: undefined;
  CallCenter: undefined;
};

// Extend AppState to define myCartItems as a number
interface ExtendedAppState extends AppState {
  myCartItems: number;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

const DownNavbar: React.FC<{ style?: any }> = ({ style }) => {
  const navigation = useNavigation<NavigationProp>();
  const [canteenId, setCanteenId] = React.useState<string | null>(null);
  const myCartItems = useSelector((state: ExtendedAppState) => state.myCartItems);

  // Log myCartItems for debugging
  console.log("myCartItemsBoom", myCartItems);

  React.useEffect(() => {
    AsyncStorage.getItem('canteenId').then(setCanteenId);
    GetCartDate()
  }, []);

    const GetCartDate = async () => {
     await fetchCartData();
  };

  const [token, setToken] = React.useState<string | null>(null);

  const getToken = async () => {
    const tokenValue = await AsyncStorage.getItem('authorization');
    const getGuestUserCartItemsCount = await AsyncStorage.getItem('guestCart');

    dispatch({
      type: 'myCartItems',
      payload: getGuestUserCartItemsCount
        ? JSON.parse(getGuestUserCartItemsCount)?.items?.length
        : 0,
    });
    setToken(tokenValue);
    return tokenValue;
  };

  React.useEffect(() => {
    getToken();
  }, []);

  // Function to handle navigation with token check

  return (
    <View style={[styles.container, style]}>

      <TouchableOpacity onPress={() => navigation.navigate('SelectCanteen')}>
        <Image
          source={require('../screens/imgs/userhome.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
{/* based on token available or not */}
{token &&

      <TouchableOpacity onPress={() => navigation.navigate('ViewOrders')}>
        <Image
          source={require('../screens/imgs/userlist.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

}

      
      <TouchableOpacity onPress={() => navigation.navigate('CartPage')}>
        <View style={styles.cartIconContainer}>
          <Image
            source={require('../screens/imgs/usercart.png')}
            style={styles.icon}
          />
          {myCartItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{myCartItems}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CallCenter')}>
        <Image
          source={require('../screens/imgs/callcenter.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 30,
    height: 30,
  },
  cartIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#0014A8', // Matches app's primary color
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default DownNavbar;