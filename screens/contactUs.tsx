import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';
import Header from './header';
import DownNavbar from './downNavbar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Constants
const COLORS = {
  PRIMARY: '#0014A8',
  TEXT_DARK: '#333',
  TEXT_SECONDARY: '#666',
  BACKGROUND: '#fff',
  BORDER: '#E0E0E0',
  MENU_BG: '#F5F5F5',
};

// Types
type ContactUsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ContactUs'
>;

interface ContactUsScreenProps {
  navigation: ContactUsScreenNavigationProp;
}

const ContactUsScreen: React.FC<ContactUsScreenProps> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header text="Contact Us" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Industrial Wet Canteens Welfare Department, Naval Dockyard
          </Text>
           <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Registered Address:</Text>
            <Text style={styles.infoText}>
                             P. No. 401, Inthuri Chamber" 4th Floor situated at M.C.K. Block No.31, Phace-4, KPHB Colony, Kukatpally Village and Mandal, GHMC Kukatpally Circle, Medchal-Malkajgiri District

            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Capture Address:</Text>
            <Text style={styles.infoText}>
                P. No. 401, Inthuri Chamber" 4th Floor situated at M.C.K. Block No.31, Phace-4, KPHB Colony, Kukatpally Village and Mandal, GHMC Kukatpally Circle, Medchal-Malkajgiri District
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Capture Contact Number:</Text>
            <Text style={styles.infoText}>9392392143</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Capture Email ID:</Text>
            <Text style={styles.infoText}>industrailcanteen@gmail.com</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered By</Text>
          <Text style={styles.footerLogo}>WorldTek.in</Text>
        </View>
      </ScrollView>
      <DownNavbar style={styles.stckyNavbar} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    padding: wp('4%'),
    paddingBottom: hp('15%'), // Space for footer and navbar
  },
  sectionContainer: {
    backgroundColor: COLORS.MENU_BG,
    padding: wp('4%'),
    borderRadius: wp('2.5%'),
    marginBottom: hp('3%'),
    borderWidth: wp('0.2%'),
    borderColor: COLORS.BORDER,
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: hp('1%'),
  },
  lastUpdated: {
    fontSize: wp('3.5%'),
    color: COLORS.TEXT_SECONDARY,
    marginBottom: hp('2%'),
  },
  infoContainer: {
    marginBottom: hp('2%'),
  },
  infoLabel: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    marginBottom: hp('0.5%'),
  },
  infoText: {
    fontSize: wp('3.8%'),
    color: COLORS.TEXT_SECONDARY,
    lineHeight: hp('3%'),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: hp('2%'),
  },
  footerText: {
    fontSize: wp('3.5%'),
    color: COLORS.TEXT_SECONDARY,
  },
  footerLogo: {
    fontSize: wp('3.5%'),
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginLeft: wp('1%'),
  },
  stckyNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default ContactUsScreen;