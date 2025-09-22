import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DownNavbar from './downNavbar';
import Header from './header';
import {MenuData, MenuItem, CartData, CartItemsState} from './types/cartTypes';
import {
  fetchCartData,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  findCartItemByItemId,
} from './services/cartHelpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {API_BASE_URL} from './services/restApi';

// Constants
const COLORS = {
  PRIMARY: '#0014A8',
  ERROR: '#ff0000',
  TEXT_SECONDARY: '#666',
  TEXT_DARK: '#222',
  TEXT_LIGHT: '#333',
  BACKGROUND: '#f7f8fa',
  CARD: '#fff',
  BORDER: '#d1d5db',
  QTY_BG: '#f0f2f5',
};

// Types
type MenuItemsByMenuIdScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MenubyMenuId'
>;

type MenuItemsByMenuIdScreenRouteProp = RouteProp<
  RootStackParamList,
  'MenubyMenuId'
>;

const MenuItemsByMenuIdScreenNew: React.FC = () => {
  const navigation = useNavigation<MenuItemsByMenuIdScreenNavigationProp>();
  const route = useRoute<MenuItemsByMenuIdScreenRouteProp>();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [cartItems, setCartItems] = useState<CartItemsState>({});
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [cartUpdated, setCartUpdated] = useState(false);
  const {menuId} = route.params;

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authorization');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/menu/getMenuById?id=${menuId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        },
      );

      const data = await response.json();
      if (data?.data) {
        const updatedMenuItems = Array.isArray(data.data.menuItems)
          ? data.data.menuItems.map((item: MenuItem) => ({
              ...item,
              minQuantity: item.minQuantity,
              maxQuantity: item.maxQuantity,
            }))
          : [];
        setMenuData({
          ...data.data,
          menuItems: updatedMenuItems,
        });
      } else {
        setError('No menu data found');
      }
    } catch (err) {
      setError('Failed to fetch menu data');
      console.error('Error fetching menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart data
  const loadCartData = async () => {
    try {
      setLoading(true);
      setCartItems({});
      const data = await fetchCartData();
      console.log('Fetched cart data:', data);
      setCartData(data);
      const cartItemsMap: CartItemsState = {};
      if (data?.cartItems && Array.isArray(data.cartItems)) {
        data.cartItems.forEach((cartItem: any) => {
          const itemIdKey = String(cartItem.itemId);
          cartItemsMap[itemIdKey] = {
            quantity: cartItem.quantity,
            cartItemId: cartItem.id,
          };
        });
      }
      setCartItems(cartItemsMap);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart data:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCartData();
    }, [cartUpdated, navigation]),
  );

  useEffect(() => {
    fetchMenuItems();
  }, [menuId]);

  const addToCart = async (item: any, menudata: MenuData) => {
    try {
      // =============storing added time into cart=========
      const currentTime = new Date().toISOString();
      await AsyncStorage.setItem('addedTime', currentTime);

      setUpdateLoading(item.id);
      const minQty = 1;
      await addItemToCart(
        item.item.id,
        item?.menuId || '',
        menudata?.menuConfiguration?.id || '',
        minQty,
      );

      const updatedCartData = await fetchCartData();
      setCartData(updatedCartData);
      setCartUpdated(true);

      const cartItem = findCartItemByItemId(updatedCartData, item.item.id);
      if (cartItem) {
        setCartItems(prev => ({
          ...prev,
          [item.item.id]: {
            quantity: cartItem.quantity,
            cartItemId: cartItem.id,
          },
        }));
      }
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setUpdateLoading(null);
    }
  };

  const increaseQuantity = async (item: MenuItem) => {
    try {
      setUpdateLoading(item.id);
      setCartUpdated(true);
      const itemId = item.item.id;
      const itemKey = String(itemId);
      const cartItem = cartData?.cartItems.find(
        cartItem => cartItem.itemId === itemId,
      );

      if (!cartItems[itemKey] || !cartItem) {
        await addToCart(item, menuData!);
        return;
      }

      const currentQty = cartItems[itemKey].quantity;
      const maxQty = Number(item.maxQuantity) || 10;
      if (currentQty >= maxQty) {
        Alert.alert('Maximum quantity reached');
        return;
      }

      const newQty = currentQty + 1;
      const cartItemId = item.itemId;
      console.log('cartItemId:=9==========', cartItemId);
      console.log('cartItemId:=======0909==========', cartData);
      await updateCartItemQuantity(cartData?.id || '', cartItemId, newQty);

      await loadCartData();
      setCartItems(prev => ({
        ...prev,
        [itemKey]: {
          ...prev[itemKey],
          quantity: newQty,
        },
      }));
    } catch (err) {
      // setError('Failed to update quantity');
      console.error('Error increasing quantity:', err);
    } finally {
      setUpdateLoading(null);
    }
  };

  const decreaseQuantity = async (item: MenuItem) => {
    try {
      setUpdateLoading(item.id);
      setCartUpdated(true);
      const itemId = item.item.id;
      const itemKey = String(itemId);
      if (!cartItems[itemKey]) return;

      const currentQty = cartItems[itemKey].quantity;
      const minQty = Number(item.minQuantity) || 1;
      const cartItemId = item.itemId;

      if (currentQty <= minQty) {
        await removeCartItem(cartData?.id || 0, cartItemId);
        await loadCartData();
        setCartItems(prev => {
          const updated = {...prev};
          delete updated[itemKey];
          return updated;
        });
      } else {
        const newQty = currentQty - 1;
        await updateCartItemQuantity(cartData?.id || '', cartItemId, newQty);
        await loadCartData();
        setCartItems(prev => ({
          ...prev,
          [itemKey]: {
            ...prev[itemKey],
            quantity: newQty,
          },
        }));
      }
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error decreasing quantity:', err);
    } finally {
      setUpdateLoading(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header text="Loading Menu" />
        <View style={styles.centeredContainer}>
          <Text style={styles.loadingText}>Loading menu items...</Text>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
        <DownNavbar />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header text="Menu Error" />
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
        <DownNavbar />
      </View>
    );
  }

  if (!menuData) {
    return (
      <View style={styles.container}>
        <Header text="No Menu" />
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>No menu data available</Text>
        </View>
        <DownNavbar />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header text={menuData?.name || 'Menu'} />
      <ScrollView contentContainerStyle={styles.menuListContainer}>
        {menuData?.menuItems?.length === 0 || !menuData?.menuItems ? (
          <View style={styles.centeredContainer}>
            <Text style={styles.noItemsText}>No menu items available</Text>
          </View>
        ) : (
          menuData.menuItems.map((item: MenuItem) => (
            <View key={item.id} style={styles.menuCard}>
              <Image
                source={{
                  uri: item?.item?.image
                    ? item?.item?.image
                    : 'https://via.placeholder.com/120',
                }}
                style={styles.menuCardImage}
              />
              <View style={styles.menuCardContent}>
                <View style={styles.menuCardHeader}>
                  <Text style={styles.menuCardName}>{item?.item?.name}</Text>
                  <Text style={styles.menuCardPrice}>
                    ₹{item.item.pricing.price}
                  </Text>
                </View>
                <View style={styles.menuCardTypeRow}>
                  <Image
                    source={{
                      uri:
                        item?.item?.type?.toLowerCase() === 'veg'
                          ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/1200px-Veg_symbol.svg.png'
                          : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Non_veg_symbol.svg/1200px-Non_veg_symbol.svg.png',
                    }}
                    style={styles.menuCardTypeIcon}
                  />
                  <Text style={styles.menuCardTypeText}>
                    {item?.item?.type?.toUpperCase() || 'N/A'}
                  </Text>
                </View>
                <Text style={styles.menuCardDesc} numberOfLines={2}>
                  {item.item.description || 'No description available'}
                </Text>
                <View style={styles.menuCardActionRow}>
                  {updateLoading === item.id ? (
                    <ActivityIndicator size="small" color={COLORS.PRIMARY} />
                  ) : !cartItems[item.item.id] ? (
                    <TouchableOpacity
                      style={styles.menuCardAddBtn}
                      onPress={() => addToCart(item, menuData)}>
                      <Text style={styles.menuCardAddBtnText}>ADD</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.menuCardQtyRow}>
                      <TouchableOpacity
                        style={styles.menuCardQtyBtn}
                        onPress={() => decreaseQuantity(item)}>
                        <Text style={styles.menuCardQtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.menuCardQtyText}>
                        {cartItems[item.item.id]?.quantity || 0}
                      </Text>
                      <TouchableOpacity
                        style={styles.menuCardQtyBtn}
                        onPress={() => increaseQuantity(item)}>
                        <Text style={styles.menuCardQtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      {Object.keys(cartItems).length > 0 && (
        <TouchableOpacity
          style={styles.goToCartButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CartPage')}>
          <Text style={styles.goToCartButtonText}>Go to Cart</Text>
        </TouchableOpacity>
      )}
      <DownNavbar />
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
  },
  menuListContainer: {
    padding: wp('4%'),
    paddingBottom: hp('15%'),
  },
  menuCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD,
    borderRadius: wp('3.5%'),
    marginBottom: hp('2%'),
    elevation: 2,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.08,
    shadowRadius: wp('2%'),
    shadowOffset: {width: 0, height: hp('0.2%')},
    padding: wp('3%'),
    alignItems: 'flex-start',
  },
  menuCardImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('2.5%'),
    marginRight: wp('3.5%'),
    backgroundColor: '#eaeaea',
  },
  menuCardContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  menuCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.2%'),
  },
  menuCardName: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    flex: 1,
    marginRight: wp('2%'),
  },
  menuCardPrice: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginLeft: wp('2%'),
  },
  menuCardTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('0.5%'),
  },
  menuCardTypeIcon: {
    width: wp('4%'),
    height: wp('4%'),
    marginRight: wp('1.5%'),
  },
  menuCardTypeText: {
    fontSize: wp('3%'),
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  menuCardDesc: {
    fontSize: wp('3.2%'),
    color: COLORS.TEXT_SECONDARY,
    marginVertical: hp('0.5%'),
    lineHeight: hp('2%'),
  },
  menuCardActionRow: {
    marginTop: hp('1%'),
    alignItems: 'flex-start',
  },
  menuCardAddBtn: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('7%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    elevation: 1,
  },
  menuCardAddBtnText: {
    color: COLORS.CARD,
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
    letterSpacing: wp('0.2%'),
  },
  menuCardQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.QTY_BG,
    borderRadius: wp('5%'),
    paddingVertical: hp('0.4%'),
    paddingHorizontal: wp('2%'),
  },
  menuCardQtyBtn: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('3.5%'),
    backgroundColor: COLORS.CARD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: wp('0.2%'),
    borderColor: COLORS.BORDER,
    marginHorizontal: wp('0.5%'),
  },
  menuCardQtyBtnText: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  menuCardQtyText: {
    marginHorizontal: wp('2.5%'),
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
  },
  goToCartButton: {
    position: 'absolute',
    bottom: hp('9%'),
    left: wp('10%'),
    right: wp('10%'),
    backgroundColor: COLORS.PRIMARY,
    borderRadius: wp('2%'),
    paddingVertical: hp('1.2%'),
    alignItems: 'center',
    zIndex: 10,
    elevation: 6,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.15,
    shadowRadius: wp('2%'),
    shadowOffset: {width: 0, height: hp('0.2%')},
    marginBottom: hp('1%'),
  },
  goToCartButtonText: {
    color: COLORS.CARD,
    fontWeight: 'bold',
    fontSize: wp('3.8%'),
    letterSpacing: wp('0.2%'),
  },
  loadingText: {
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: hp('2%'),
    fontSize: wp('4%'),
  },
  errorText: {
    color: COLORS.ERROR,
    textAlign: 'center',
    marginBottom: hp('2%'),
    fontSize: wp('4%'),
  },
  noItemsText: {
    color: '#000',
    textAlign: 'center',
    fontSize: wp('4.5%'),
    fontWeight: '600',
    marginBottom: hp('2%'),
  },
});

export default MenuItemsByMenuIdScreenNew;
