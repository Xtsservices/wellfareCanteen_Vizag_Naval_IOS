import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from './restApi';

// Get authorization token
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authorization');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
};

// Get cart data
export const fetchCartData = async () => {
  try {
    const token = await getAuthToken();
    console.log('response data cart======start=======/cart/getCart');

    const response = await axios.get(`${API_BASE_URL}/cart/getCart`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });
    console.log('fetchCartData==stand', response);

    if (response.data && response.data.data) {
      console.log(
        'fetchCartData==stand=====================',
        response.data.data,
      );
      // ✅ Corrected this line

      const orders = response.data.data;
      if (orders.cartItems) {
        orders.cartItems.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      }

      return orders;
    } else {
      throw new Error('No cart data found');
    }
  } catch (error) {
    // console.error('Error fetching cart data:carthelpers', error);
    throw error;
  }
};

// Add item to cart
export const addItemToCart = async (
  itemId: string | number,
  menuId: string | number | undefined,
  menuConfigId: string | number | undefined,
  quantity: number,
) => {
  try {
    const token = await getAuthToken();
    const canteenId = await AsyncStorage.getItem('canteenId');
    const date = await AsyncStorage.getItem('selectedDate');
    console.log('datesssss', date);

    //   {

    //     "itemId": 2,
    //     "quantity": 3,
    //     "menuId": 1,
    //     "canteenId": 1,
    //     "menuConfigurationId": 1
    // }

    const payload = {
      itemId: Number(itemId),
      quantity,
      menuId: Number(menuId),
      canteenId: Number(canteenId) || 1,
      menuConfigurationId: Number(menuConfigId),
      orderDate: date,
    };

    console.log('Add item payload:', payload);
    console.log('Token:', token);

    const response = await axios.post(`${API_BASE_URL}/cart/add`, payload, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });
    console.log('Response from addItemToCart:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const deleteUseraccount = async () => {
  try {
    const token = await getAuthToken();
    const response = await axios.delete(`${API_BASE_URL}/deleteAccount`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });
    // console.log('Response from clearCart:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error delete user account:', error);
    throw error;
  }
};

//addToCartItems for IOS multiple items
export const addToCartItemsForIOS = async (guestCart: any) => {
  try {
    const token = await getAuthToken();
    console.log('Add to cart items payload:', guestCart);

    const response = await axios.post(`${API_BASE_URL}/cart/addToCartForIOS`, guestCart, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });
    console.log('Response from addToCartItems:', response.data);
    return response.data;
  } catch (error) {
    console.log(error,"error in addToCartItemsForIOS");
    console.error('Error adding multiple items to cart:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (
  cartId: number | string | undefined | null,
  cartItemId: number | string | undefined | null,
  quantity: number,
) => {
  console.log(
    cartId,
    'cartId',
    cartItemId,
    '----cartitemid',
    quantity,
    '----quantity',
  );

  try {
    const token = await getAuthToken();

    const payload = {
      cartId,
      cartItemId,
      quantity,
    };

    console.log('Update payload:===========', payload);

    const response = await axios.post(
      `${API_BASE_URL}/cart/updateCartItem`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    );
    console.log('Response from updateCartItemQuantity:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error updating cart item quantity', error);
    throw error;
  }
};

// Remove item from cart
export const removeCartItem = async (
  cartId: number,
  cartItemId: number | null | undefined,
) => {
  console.log(cartId, 'cartId', cartItemId, '----cartitemid------cartHelpers');

  try {
    const token = await getAuthToken();

    const payload = {
      cartId,
      cartItemId,
    };
    console.log('Remove item payload:', payload);
    console.log('Remove item payload:', API_BASE_URL);

    const response = await axios.post(
      `${API_BASE_URL}/cart/removeCartItem`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      },
    );
    console.log('Response from removeCartItem:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/cart/clearCart`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};



// Find cart item by item ID
export const findCartItemByItemId = (
  cartData: any,
  itemId: string | number,
) => {
  if (!cartData || !cartData.cartItems || !cartData.cartItems.length) {
    return null;
  }

  return cartData.cartItems.find(
    (cartItem: any) =>
      String(cartItem.itemId) === String(itemId) ||
      (cartItem.item && String(cartItem.item.id) === String(itemId)),
  );
};

// --------------------------------------------------------------------------------

export const fetchDashboardData = async () => {
  try {
    const token = await AsyncStorage.getItem('authorization');
    const response = await fetch(`${API_BASE_URL}/adminDasboard/dashboard`, {
      headers: {
        Authorization: token || '',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchRecentOrders = async () => {
  try {
    const token = await AsyncStorage.getItem('authorization');
    const response = await fetch(
      `${API_BASE_URL}/adminDasboard/getTotalOrders`,
      {
        headers: {
          Authorization: token || '',
        },
      },
    );
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


// Clear cart
export const logout = async () => {
  try {
    const token = await getAuthToken();
    console.log("logout api hit",`${API_BASE_URL}/logout`);
    const response = await axios.get(`${API_BASE_URL}/logout`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });
    // console.log('Response from clearCart:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error logout:', error);
    throw error;
  }
};
