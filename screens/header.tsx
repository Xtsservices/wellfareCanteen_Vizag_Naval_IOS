import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearCart as clearCartHelper,
} from './services/cartHelpers';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

interface HeaderProps {
  text: string;
}

const Header: React.FC<HeaderProps> = ({text}) => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();



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


  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('SelectCanteen')}>
        <Image
          source={require('../screens/imgs/navallogo.png')} // Adjust path to your logo
          style={styles.logo}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{text}</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('WalletScreen')}>
          <Image
            source={require('../screens/imgs/wallet_png.png')} // Adjust path to your wallet icon
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('SettingsScreen')}>
          <Image
            source={require('../screens/imgs/1077114.png')} // Adjust path to your profile icon
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0014A8', // Original dark blue background
    paddingVertical: hp('0.7%'),
    paddingHorizontal: wp('5%'),
    borderBottomLeftRadius: wp('4%'),
    borderBottomRightRadius: wp('4%'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  logo: {
    width: wp('18%'), // Larger logo for prominence
    height: wp('18%'),
    resizeMode: 'contain',
  },
  headerTitle: {
    color: '#fff',
    fontSize: wp('4%'), // Responsive font size
    fontWeight: '700',
    flex: 1, // Allow title to take available space
    textAlign: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#fff',
    borderRadius: wp('50%'),
    padding: wp('2%'),
    marginLeft: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: wp('5%'), // Consistent icon size
    height: wp('5%'),
    resizeMode: 'contain',
  },
});

export default Header;
