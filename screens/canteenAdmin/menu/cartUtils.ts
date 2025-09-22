import AsyncStorage from '@react-native-async-storage/async-storage';
import {CartData, CartItem} from './types';
import { API_BASE_URL } from '../../services/restApi';


// Format time from timestamp
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};

// Format date for display
export const formatDateDisplay = (dateString: string): string => {
  const [day, month, year] = dateString.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
