
// const URL = 'http://192.168.0.104:3000/api';
const URL = 'https://server.welfarecanteen.in/api';

export const API_BASE_URL = URL;
export const Login = () => `${URL}/login`;
export const VerifyOtp = () => `${URL}/verifyOtp`;
export const ResendOtp = () => `${URL}/resendOtp`;
export const AllCanteens = () => `${URL}/user/getAllCanteens`;
// export const MenuItems = (canteenId: string) =>
//   `${URL}/user/getMenuItems?canteenId=${canteenId}`;
export const GetMenuItemsbyCanteenId = (canteenId: string) =>
  `${URL}/menu/getMenusForNextTwoDaysGroupedByDateAndConfiguration?canteenId=${canteenId}`;
