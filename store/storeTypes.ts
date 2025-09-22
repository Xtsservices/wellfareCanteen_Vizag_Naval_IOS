// types.ts

// Define user data type
export interface UserData {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  mobile: string;
  canteenId: number | null;
  createdAt: string; 
  updatedAt: string;
  userRoles: string[];
}
// App state structure
export interface AppState {
  currentUserData: UserData | null;
  myCartItems: number;
  checkoutTotalBalance: number;
}

// Action type
export interface Action {
  type: string;
  payload?: any;
}
