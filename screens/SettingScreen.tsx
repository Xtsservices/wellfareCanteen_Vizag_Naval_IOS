import React, {useState, useCallback, useEffect} from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';
import Header from './header';
import DownNavbar from './downNavbar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {logout} from './services/cartHelpers';

// Constants
const COLORS = {
  PRIMARY: '#0014A8',
  PRIMARY_LIGHT: '#E3F2FD',
  ACCENT: '#FF6B35',
  TEXT_DARK: '#1A1A1A',
  TEXT_SECONDARY: '#666666',
  TEXT_LIGHT: '#999999',
  BACKGROUND: '#FAFAFA',
  CARD_BG: '#FFFFFF',
  BORDER: '#E8E8E8',
  MENU_BG: '#F8F9FA',
  LOGOUT_BG: '#FFF5F5',
  ERROR: '#FF4444',
  SUCCESS: '#4CAF50',
  SHADOW: 'rgba(0, 0, 0, 0.1)',
};

// Types
type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SettingsScreen'
>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

interface UserProfile {
  phoneNumber: string;
  name?: string;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem('phoneNumber');
        const userName = await AsyncStorage.getItem('userName'); // If you store user name

        if (phoneNumber) {
          setUserProfile({
            phoneNumber,
            name: userName || 'User', // Default name if not available
          });
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for better display (e.g., +91 98765 43210)
    if (phone.length === 10) {
      return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
    }
    return phone;
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'Order History',
      subtitle: 'View your past orders',
      icon: 'https://cdn-icons-png.freepik.com/256/3081/3081840.png',
      onPress: () => navigation.navigate('ViewOrders'),
      color: '#FF6B35',
    },
    {
      id: 'wallet',
      title: 'Wallet',
      subtitle: 'Manage your payments',
      icon: 'https://cdn-icons-png.freepik.com/256/2331/2331966.png',
      onPress: () => navigation.navigate('WalletScreen'),
      color: '#4CAF50',
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      subtitle: 'Read our policies',
      icon: 'https://cdn-icons-png.freepik.com/256/1048/1048298.png',
      onPress: () => navigation.navigate('privacypolicy'),
      color: '#2196F3',
    },
    {
      id: 'contact',
      title: 'Contact Us',
      subtitle: 'Get help and support',
      icon: 'https://cdn-icons-png.freepik.com/256/3059/3059590.png',
      onPress: () => navigation.navigate('ContactUs'),
      color: '#9C27B0',
    },
  ];

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);

      // const resp = await logout();
      // console.log("logout resp", resp);

      await Promise.all([
        AsyncStorage.removeItem('authorization'),
        AsyncStorage.removeItem('phoneNumber'),
        AsyncStorage.removeItem('userName'),
        AsyncStorage.removeItem('canteenId'),
        AsyncStorage.removeItem('selectedDate'),
        AsyncStorage.removeItem('cartId'),
        AsyncStorage.removeItem('itemId'),
      ]);
      setIsLoggedIn(false);
      navigation.replace('SelectCanteen');
    } catch (e) {
        await Promise.all([
        AsyncStorage.removeItem('authorization'),
        AsyncStorage.removeItem('phoneNumber'),
        AsyncStorage.removeItem('userName'),
        AsyncStorage.removeItem('canteenId'),
        AsyncStorage.removeItem('selectedDate'),
        AsyncStorage.removeItem('cartId'),
        AsyncStorage.removeItem('itemId'),
      ]);
      setIsLoggedIn(false);
      navigation.replace('SelectCanteen');
      console.error('Logout error:', e);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  const confirmLogout = useCallback(() => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: handleLogout,
        },
      ],
      {cancelable: true},
    );
  }, [handleLogout]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header text="Settings" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
        <DownNavbar style={styles.stickyNavbar} />
      </SafeAreaView>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <Header text="Settings" />
        <View style={styles.loggedOutContainer}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/1077/1077114.png',
            }}
            style={styles.loggedOutIcon}
          />
          <Text style={styles.loggedOutTitle}>Not Logged In</Text>
          <Text style={styles.loggedOutText}>
            Please log in to access your settings and profile information.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.replace('Login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <DownNavbar style={styles.stickyNavbar} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header text="Settings" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.freepik.com/256/3135/3135715.png',
                }}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {userProfile?.name || 'Welcome User'}
              </Text>
              <Text style={styles.profilePhone}>
                {userProfile?.phoneNumber
                  ? formatPhoneNumber(userProfile.phoneNumber)
                  : 'No phone number'}
              </Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: item.color + '20'},
                ]}>
                <Image
                  style={[styles.menuIcon, {tintColor: item.color}]}
                  source={{uri: item.icon}}
                />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.freepik.com/256/318/318476.png',
                }}
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Add extra padding for bottom container */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Container */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/1828/1828490.png',
            }}
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered By </Text>
          <Text style={styles.footerLogo}>WorldTek.in</Text>
        </View>
      </View>

      <DownNavbar style={styles.stickyNavbar} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: wp('4%'),
    color: COLORS.TEXT_SECONDARY,
  },
  loggedOutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('8%'),
  },
  loggedOutIcon: {
    width: wp('20%'),
    height: wp('20%'),
    marginBottom: hp('3%'),
    tintColor: COLORS.TEXT_LIGHT,
  },
  loggedOutTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: hp('1%'),
  },
  loggedOutText: {
    fontSize: wp('4%'),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: wp('5.5%'),
    marginBottom: hp('4%'),
  },
  loginButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('6%'),
  },
  loginButtonText: {
    color: COLORS.CARD_BG,
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
  },
  profileCard: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginBottom: hp('3%'),
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: wp('4%'),
  },
  avatar: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('8%'),
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: wp('3.5%'),
    height: wp('3.5%'),
    borderRadius: wp('1.75%'),
    backgroundColor: COLORS.SUCCESS,
    borderWidth: 2,
    borderColor: COLORS.CARD_BG,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginBottom: hp('0.5%'),
  },
  profilePhone: {
    fontSize: wp('4%'),
    color: COLORS.TEXT_SECONDARY,
    marginBottom: hp('1%'),
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.SUCCESS + '20',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('1%'),
  },
  verifiedText: {
    fontSize: wp('3%'),
    color: COLORS.SUCCESS,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    marginBottom: hp('2%'),
    marginLeft: wp('1%'),
  },
  menuContainer: {
    marginBottom: hp('3%'),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_BG,
    padding: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('1.5%'),
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('4%'),
  },
  menuIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    marginBottom: hp('0.2%'),
  },
  menuSubtitle: {
    fontSize: wp('3.2%'),
    color: COLORS.TEXT_SECONDARY,
  },
  chevron: {
    width: wp('4%'),
    height: wp('4%'),
    tintColor: COLORS.TEXT_LIGHT,
  },
  appInfoCard: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  appInfoTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    marginBottom: hp('1.5%'),
  },
  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('0.5%'),
  },
  appInfoLabel: {
    fontSize: wp('3.5%'),
    color: COLORS.TEXT_SECONDARY,
  },
  appInfoValue: {
    fontSize: wp('3.5%'),
    color: COLORS.TEXT_DARK,
    fontWeight: '500',
  },
  bottomPadding: {
    height: hp('15%'),
  },
  bottomContainer: {
    position: 'absolute',
    bottom: hp('8%'),
    left: 0,
    right: 0,
    paddingHorizontal: wp('4%'),
    backgroundColor: COLORS.BACKGROUND,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderColor: COLORS.ERROR,
    borderWidth: 1.5,
    backgroundColor: COLORS.LOGOUT_BG,
    marginBottom: hp('1%'),
  },
  logoutIcon: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    tintColor: COLORS.ERROR,
    marginRight: wp('2%'),
  },
  logoutText: {
    color: COLORS.ERROR,
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  footerText: {
    fontSize: wp('3.2%'),
    color: COLORS.TEXT_LIGHT,
  },
  footerLogo: {
    fontSize: wp('3.2%'),
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  stickyNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default SettingsScreen;
