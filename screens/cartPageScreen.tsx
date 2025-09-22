import React, {useEffect, useState, useCallback, memo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from './header';
import DownNavbar from './downNavbar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {CartData, CartItem} from './types/cartTypes';
import {
  fetchCartData,
  updateCartItemQuantity,
  removeCartItem,
  clearCart as clearCartHelper,
} from './services/cartHelpers';
import {useDispatch} from 'react-redux';

// Constants
const COLORS = {
  PRIMARY: '#0014A8', // Vibrant blue
  ERROR: '#ff4d4d', // Red for errors
  TEXT_SECONDARY: '#666', // Gray for secondary text
  TEXT_DARK: '#222', // Dark gray for primary text
  TEXT_LIGHT: '#888', // Light gray for subtle text
  BACKGROUND: '#F4F6FB', // Light blue background
  CARD: '#fff', // White for cards
  CLEAR_BUTTON: '#ffeded', // Light red for clear button
  BORDER: '#e6eaf2', // Light border color
};

// Type Definitions
type NavigationProp = {
  navigate: (screen: string) => void;
  goBack: () => void;
};

// Cart Item Component
const CartItemComponent = memo(
  ({
    item,
    onUpdateQuantity,
    onRemove,
    updatingItems,
  }: {
    item: CartItem;
    onUpdateQuantity: (newQuantity: number) => void;
    onRemove: () => void;
    updatingItems: number[];
  }) => (
    <View style={styles.cartItemCard}>
      <Image
        source={{
          uri: item.item.image
            ? item.item.image
            : 'https://via.placeholder.com/80',
        }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.item.name}
          </Text>
          <TouchableOpacity
            onPress={onRemove}
            style={styles.removeIconButton}
            hitSlop={{
              top: wp('2%'),
              bottom: wp('2%'),
              left: wp('2%'),
              right: wp('2%'),
            }}>
            <Text style={styles.removeIconText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.typeRow}>
          <Image
            source={{
              uri:
                item.item.type?.toLowerCase() === 'veg'
                  ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/1200px-Veg_symbol.svg.png'
                  : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Non_veg_symbol.svg/1200px-Non_veg_symbol.svg.png',
            }}
            style={styles.typeIcon}
          />
          <Text style={styles.typeText}>
            {item.item.type?.toUpperCase() || 'N/A'}
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
          <Text style={styles.itemTotal}>Total: ₹{item.total.toFixed(2)}</Text>
        </View>
        <View style={styles.quantityRow}>
          {updatingItems.includes(item.id) ? (
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.qtyBtn,
                  {opacity: item.quantity === 1 ? 0.5 : 1},
                ]}
                onPress={() =>
                  item.quantity > 1 && onUpdateQuantity(item.quantity - 1)
                }
                disabled={item.quantity === 1}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onUpdateQuantity(item.quantity + 1)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  ),
);

// Bill Summary Component
const BillSummary = memo(
  ({
    subtotal,
    totalAmount,
    onPay,
    onClear,
  }: {
    subtotal: number;
    totalAmount: number;
    onPay: () => void;
    onClear: () => void;
  }) => (
    <View style={styles.billCard}>
      <View style={styles.billRow}>
        <Text style={styles.billLabel}>Subtotal</Text>
        <Text style={styles.billValue}>₹{subtotal.toFixed(2)}</Text>
      </View>
      <View style={[styles.billRow, styles.billTotalRow]}>
        <Text style={styles.billTotalLabel}>Total</Text>
        <Text style={styles.billTotalValue}>₹{totalAmount.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.payBtn} onPress={onPay}>
        <Text style={styles.payBtnText}>Proceed to Payment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.clearCartBtn} onPress={onClear}>
        <Text style={styles.clearCartBtnText}>Clear Cart</Text>
      </TouchableOpacity>
    </View>
  ),
);

// Empty Cart Component
const EmptyCart = memo(
  ({onContinueShopping}: {onContinueShopping: () => void}) => (
    <View style={styles.emptyCartContainer}>
      <Image
        source={{uri: 'https://img.icons8.com/ios/100/000000/empty-cart.png'}}
        style={styles.emptyCartIcon}
      />
      <Text style={styles.emptyCartText}>Your cart is empty</Text>
      <TouchableOpacity
        style={styles.continueShoppingButton}
        onPress={onContinueShopping}>
        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  ),
);

const CartPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItems, setUpdatingItems] = useState<number[]>([]);
  const dispatch = useDispatch();
  
  const loadCartData = async () => {
    try {
      console.log('first step 3');
      setLoading(true);
      const data = await fetchCartData();
      console.log('Loading========loadCartData============', data);
      setCartData(data);
      setError("")
    } catch (err) {
      setCartData(null);
      console.error('Error fetching cart data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
  }, []);

  const updateItemQuantity = useCallback(
    async (cartItem: CartItem, newQuantity: number) => {
      console.log(
        'updateItemQuantity====================',
        cartItem,
        newQuantity,
      );
      try {
        setUpdatingItems(prev => [...prev, cartItem.id]);
        await updateCartItemQuantity(
          cartData?.id || 0,
          cartItem.itemId,
          newQuantity,
        );
        await loadCartData();
      } catch (err) {
        console.log('Error updating cart item', err);
        // setError('Failed to update cart item');
      } finally {
        setUpdatingItems(prev => prev.filter(id => id !== cartItem.id));
      }
    },
    [cartData?.id, loadCartData],
  );

  const handleRemoveItem = useCallback(
    async (item: CartItem) => {
      try {
        if (!cartData) return;
        setUpdatingItems(prev => [...prev, item.id]);
        console.log('first step 1');
        await removeCartItem(Number(item.cartId), Number(item.itemId));
        console.log('first step 2');

        await loadCartData();
      } catch (err) {
        // setError('Failed to remove cart item');
        console.error('Error removing cart item:', err);
      } finally {
        setUpdatingItems(prev => prev.filter(id => id !== item.id));
      }
    },
    [cartData, loadCartData],
  );

  const handleClearCart = useCallback(async () => {
    try {
      setLoading(true);
      await clearCartHelper();

      setCartData({
        id: 0,
        cartItems: [],
        totalAmount: 0,
        menuConfiguration: {name: ''},
      });
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmClearCart = useCallback(() => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your cart?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', onPress: handleClearCart, style: 'destructive'},
      ],
      {cancelable: true},
    );
  }, [handleClearCart]);

    const calculateTotal = useCallback(() => {
    if (!cartData?.cartItems?.length) return {subtotal: 0, totalAmount: 0};
    const subtotal = cartData.cartItems.reduce(
      (sum, item) => sum + item.total,
      0,
    );
    const gstAndCharges = subtotal * 0.0; // 0% GST
    const platformFee = 0; // Fixed platform fee
    const totalAmount = subtotal + gstAndCharges + platformFee;

    // Update the store with the total amount
    dispatch({
      type: 'checkoutTotalBalance',
      payload: totalAmount,
    });
    
    return {subtotal, totalAmount};
  }, [cartData]);

  const {subtotal, totalAmount} = calculateTotal();


  const handlePayment = useCallback(() => {
    //here we need to set total amount into store


    navigation.navigate('PaymentMethod');
  }, [navigation]);



useFocusEffect(
  React.useCallback(() => {
    const checkCartTime = async () => {
      try {
        const addedTime = await AsyncStorage.getItem('addedTime');
        if (addedTime) {
          const addedDate = new Date(addedTime);
          const now = new Date();
          const diffMs = now.getTime() - addedDate.getTime();
          const diffMins = diffMs / (1000 * 60);
          if (diffMins >= 30) {
            await AsyncStorage.removeItem('addedTime');
            await clearCartHelper();
          }
        }
      } catch (e) {
        console.error('Error checking cart time:', e);
      }
    };

    checkCartTime();
  }, [navigation]),
);

if (loading) {
  return (
    <View style={styles.container}>
      <Header text="My Cart" />
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
      <DownNavbar />
    </View>
  );
}

if (error) {
  return (
    <View style={styles.container}>
      <Header text="My Cart" />
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadCartData}>
          <Text style={styles.refreshButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
      <DownNavbar />
    </View>
  );
}


return (
    <View style={styles.container}>
      <Header text="My Cart" />
      {cartData?.cartItems?.length ? (
        <>
          <ScrollView contentContainerStyle={styles.cartItems}>
            {cartData.cartItems.map(item => (
              <CartItemComponent
                key={item.id}
                item={item}
                onUpdateQuantity={newQuantity =>
                  updateItemQuantity(item, newQuantity)
                }
                onRemove={() => handleRemoveItem(item)}
                updatingItems={updatingItems}
              />
            ))}
          </ScrollView>
          <BillSummary
            subtotal={subtotal}
            totalAmount={totalAmount}
            onPay={handlePayment}
            onClear={confirmClearCart}
          />
        </>
      ) : (
        <EmptyCart onContinueShopping={() => navigation.navigate('Dashboard')} />
      )}
      <DownNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND, // #F4F6FB
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
  },
  errorText: {
    color: COLORS.ERROR, // #ff4d4d
    fontSize: wp('4.2%'),
    fontWeight: '600',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: COLORS.PRIMARY, // #0014A8
    borderRadius: wp('2%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('6%'),
    alignItems: 'center',
  },
  refreshButtonText: {
    color: COLORS.CARD, // #fff
    fontSize: wp('3.8%'),
    fontWeight: '600',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
  },
  emptyCartIcon: {
    width: wp('25%'),
    height: wp('25%'),
    marginBottom: hp('3%'),
    tintColor: COLORS.TEXT_LIGHT, // #888
  },
  emptyCartText: {
    fontSize: wp('4.8%'),
    color: COLORS.TEXT_DARK, // #222
    fontWeight: '600',
    marginBottom: hp('3%'),
    textAlign: 'center',
  },
  continueShoppingButton: {
    backgroundColor: COLORS.PRIMARY, // #0014A8
    borderRadius: wp('2%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('8%'),
    alignItems: 'center',
  },
  continueShoppingText: {
    color: COLORS.CARD, // #fff
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  cartItems: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    paddingBottom: hp('20%'), // Extra padding to avoid overlap with BillSummary
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD, // #fff
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    padding: wp('3.5%'),
    elevation: 2,
    shadowColor: COLORS.PRIMARY, // #0014A8
    shadowOffset: {width: 0, height: hp('0.2%')},
    shadowOpacity: 0.08,
    shadowRadius: wp('1.5%'),
  },
  itemImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('2%'),
    backgroundColor: COLORS.BORDER, // #e6eaf2
  },
  itemInfo: {
    flex: 1,
    marginLeft: wp('3%'),
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK, // #222
    flex: 1,
    marginRight: wp('2%'),
  },
  removeIconButton: {
    backgroundColor: COLORS.CLEAR_BUTTON, // #ffeded
    borderRadius: wp('50%'),
    padding: wp('1.5%'),
  },
  removeIconText: {
    color: COLORS.ERROR, // #ff4d4d
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('0.5%'),
  },
  typeIcon: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    marginRight: wp('1.5%'),
  },
  typeText: {
    fontSize: wp('3.2%'),
    color: COLORS.TEXT_SECONDARY, // #666
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: hp('0.5%'),
  },
  itemPrice: {
    fontSize: wp('3.8%'),
    color: COLORS.PRIMARY, // #0014A8
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: wp('3.5%'),
    color: COLORS.TEXT_SECONDARY, // #666
    fontWeight: '500',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  qtyBtn: {
    backgroundColor: COLORS.PRIMARY, // #0014A8
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    color: COLORS.CARD, // #fff
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  quantity: {
    marginHorizontal: wp('3%'),
    fontSize: wp('4%'),
    minWidth: wp('6%'),
    textAlign: 'center',
    color: COLORS.TEXT_DARK, // #222
    fontWeight: '600',
  },
  billCard: {
    backgroundColor: COLORS.CARD, // #fff
    borderRadius: wp('3%'),
    marginHorizontal: wp('4%'),
    marginBottom: hp('10%'), // Space for DownNavbar
    padding: wp('4%'),
    elevation: 3,
    shadowColor: COLORS.PRIMARY, // #0014A8
    shadowOffset: {width: 0, height: hp('0.3%')},
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  billLabel: {
    color: COLORS.TEXT_SECONDARY, // #666
    fontSize: wp('3.8%'),
    fontWeight: '500',
  },
  billValue: {
    color: COLORS.TEXT_DARK, // #222
    fontSize: wp('3.8%'),
    fontWeight: '500',
  },
  billTotalRow: {
    borderTopWidth: wp('0.2%'),
    borderTopColor: COLORS.BORDER, // #e6eaf2
    marginTop: hp('1%'),
    paddingTop: hp('1%'),
  },
  billTotalLabel: {
    fontWeight: '600',
    fontSize: wp('4%'),
    color: COLORS.PRIMARY, // #0014A8
  },
  billTotalValue: {
    fontWeight: '600',
    fontSize: wp('4%'),
    color: COLORS.PRIMARY, // #0014A8
  },
  payBtn: {
    backgroundColor: COLORS.PRIMARY, // #0014A8
    borderRadius: wp('2%'),
    marginTop: hp('2%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    elevation: 2,
  },
  payBtnText: {
    color: COLORS.CARD, // #fff
    fontSize: wp('4%'),
    fontWeight: '600',
    letterSpacing: wp('0.1%'),
  },
  clearCartBtn: {
    marginTop: hp('1.5%'),
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  clearCartBtnText: {
    color: COLORS.ERROR, // #ff4d4d
    fontSize: wp('3.8%'),
    fontWeight: '500',
  },
});

export default CartPage;
