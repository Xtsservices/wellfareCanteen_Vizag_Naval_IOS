// store.ts
import {createStore} from 'redux';
import {Action, AppState} from './storeTypes';

const initialData: AppState = {
  currentUserData: null,
  myCartItems: 0,
  checkoutTotalBalance: 0,
};

function Reducer(state: AppState = initialData, action: Action): AppState {
  switch (action.type) {
    case 'currentUserData':
      return {...state, currentUserData: action.payload};
    case 'myCartItems':
      return {...state, myCartItems: action.payload};
    case 'checkoutTotalBalance':
      return {...state, checkoutTotalBalance: action.payload};
    default:
      return state;
  }
}

const store = createStore(Reducer);
export default store;
export const dispatch = store.dispatch;
