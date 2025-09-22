import { useState, useEffect } from 'react';
import { View, Text, Button, Linking, StyleSheet, TouchableOpacity,Platform } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import SplashScreen from './screens/splashscreen';
import CheckUserLogin from './screens/CheckUserLogin';
import ProfileScreen from './screens/profileScreen';
import LoginScreen from './screens/login';
import SelectCanteenScreen from './screens/selectCanteen';
import Dashboard from './screens/dashboard';
import OrderPlacedScreen from './screens/orderPlaced';
import ViewOrders from './screens/viewOrders';
import PaymentMethod from './screens/paymentsMethod';
import SettingsScreen from './screens/SettingScreen';
import AdminDashboard from './screens/canteenAdmin/adminDashboard';
import BluetoothControlScreen from './screens/canteenAdmin/scanQr';
import WalletScreen from './screens/WalletScreen';
import orderhistory from './screens/orderhistory';
import NotificationsScreen from './screens/NotificationsScreen';
import Users from './screens/canteenAdmin/Users';
import AddUser from './screens/canteenAdmin/AddUser';
import WorkerProfile from './screens/canteenAdmin/WorkerProfile';
import OrderDetails from './screens/canteenAdmin/OrderDetails';
import MenuItemDetails from './screens/canteenAdmin/menu/[menuId]';
import Payment from './screens/canteenAdmin/menu/Payment';
import CartScreen from './screens/canteenAdmin/cart/index';
import VerifyTokenScreen from './screens/canteenAdmin/veifyToken';
import MenuItemsByMenuIdScreenNew from './screens/menuItemByMenuIdScreen';
import CartPageTwo from './screens/cartPageScreen';
import { RootStackParamList } from './screens/navigationTypes';
import CallCenterScreen from './screens/callCenter';
import MenuScreenNew from './screens/canteenAdmin/menu/MenuScreenNew';
import CashFreeSdk from './screens/cashFreeSDK/CashFreeSdk';
import PaymentStatusScreen from './screens/PaymentStatusScreen';
import PrivacyPolicy from './screens/PrivacyPolicy';
import ContactUsScreen from './screens/contactUs';

import DeviceInfo from "react-native-device-info";

const Stack = createNativeStackNavigator<RootStackParamList>();
const FORCE_UPDATE_URL = 'https://server.welfarecanteen.in/app-version';

const App = () => {
  const [forceUpdate, setForceUpdate] = useState(false);

    useEffect(() => {
    checkVersion();
  }, []);

  const checkVersion = async () => {
    try {
       if (Platform.OS !== "android") {
    // Skip version check for iOS
    return;
       }
      // 1. Get current app versionCode
      const currentVersion = parseInt(DeviceInfo.getBuildNumber()); // e.g. "5"
      // 2. Fetch latest minVersionCode from backend
      const res = await fetch(FORCE_UPDATE_URL);
      const data = await res.json();
      console.log("currentVersion", currentVersion);
      console.log("minVersionCode", data.minVersionCode);

      if (currentVersion < data.minVersionCode) {
        setForceUpdate(true);
      }
    } catch (err) {
      console.log("Version check failed:", err);
    }
  };

  const openPlayStore = () => {
    Linking.openURL("https://play.google.com/store/apps/details?id=com.wellfarecanteen"); // replace with your packageId
  };

if (forceUpdate) {
  return (
    <View style={styles.forceUpdateContainer}>
      {/* Main content */}
      <View style={styles.contentContainer}>
        {/* Icon container */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🚀</Text>
          </View>
        </View>
        
        {/* Title */}
        <Text style={styles.title}>Update Available</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          We've made some exciting improvements!{'\n'}
          Please update to continue enjoying the app.
        </Text>
        
        {/* Features list */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureText}>Enhanced performance</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔧</Text>
            <Text style={styles.featureText}>Bug fixes & improvements</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎨</Text>
            <Text style={styles.featureText}>Fresh new features</Text>
          </View>
        </View>
        
        {/* Update button */}
        <TouchableOpacity style={styles.updateButton} onPress={openPlayStore}>
          <Text style={styles.buttonText}>Update Now</Text>
          <Text style={styles.buttonIcon}>→</Text>
        </TouchableOpacity>
        
        {/* Version info */}
        <Text style={styles.versionText}>
          This update is required to continue
        </Text>
      </View>
    </View>
  );
}


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Splash'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="CheckUserLogin" component={CheckUserLogin} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SelectCanteen" component={SelectCanteenScreen} />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          initialParams={{ canteenId: undefined }}
        />
        <Stack.Screen name="CartPage" component={CartPageTwo} />
        <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} />
        <Stack.Screen name="ViewOrders" component={ViewOrders} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="WalletScreen" component={WalletScreen} />
        <Stack.Screen name="orderhistory" component={orderhistory} />
        <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
        <Stack.Screen name="MenuScreenNew" component={MenuScreenNew} />
        <Stack.Screen name="MenuItemDetails" component={MenuItemDetails} />
        <Stack.Screen name="CallCenter" component={CallCenterScreen} />
        <Stack.Screen
          name="MenubyMenuId"
          component={MenuItemsByMenuIdScreenNew}
          initialParams={{ menuId: undefined }}
        />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="WorkerProfile" component={WorkerProfile} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="BluetoothControl" component={BluetoothControlScreen} />
        <Stack.Screen name="VerifyToken" component={VerifyTokenScreen} />
        <Stack.Screen name="SdkHome" component={CashFreeSdk} />
        <Stack.Screen name="PaymentStatusScreen" component={PaymentStatusScreen} />
        <Stack.Screen name="privacypolicy" component={PrivacyPolicy} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};



const styles = StyleSheet.create({
  forceUpdateContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0284c7',
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  updateButton: {
    width: '100%',
    backgroundColor: '#dc2626',
    marginBottom: 20,
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 10,
  },
  buttonIcon: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  versionText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default App;