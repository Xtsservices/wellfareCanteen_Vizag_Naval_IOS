import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DownNavbar from './downNavbar';
import Header from './header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import YoutubePlayer from 'react-native-youtube-iframe';

// Constants
const API_URL = 'https://iqtelephony.airtel.in/gateway/airtel-xchange/v2/execute/workflow';
const COLORS = {
  PRIMARY: '#0014A8',
  TEXT_DARK: '#222',
  TEXT_SECONDARY: '#555',
  BACKGROUND: '#fff',
  CARD_1: '#e3f2fd',
  CARD_2: '#fff3e0',
  CARD_3: '#e8f5e9',
};

// Types
type CallOption = 1 | 2 | 3;

const VIDEOS = [
  {
    id: "jqI5myb9qCM",
    title: "Telugu Support Guide",
    language: "Telugu",
    thumbnail: "https://img.youtube.com/vi/jqI5myb9qCM/maxresdefault.jpg",
  },
  {
    id: "ibCUNjQ5BA8",
    title: "Hindi Support Guide", 
    language: "Hindi",
    thumbnail: "https://img.youtube.com/vi/ibCUNjQ5BA8/maxresdefault.jpg",
  },
  {
    id: "S6mvxC0Gtno",
    title: "English Support Guide",
    language: "English", 
    thumbnail: "https://img.youtube.com/vi/S6mvxC0Gtno/maxresdefault.jpg",
  },
];

const CallCenterScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  // Fetch phone number once on mount
  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const value = await AsyncStorage.getItem('phoneNumber');
        setPhoneNumber(value);
      } catch (error) {
        console.error('Error fetching phone number:', error);
      }
    };
    fetchPhoneNumber();
  }, []);

  const handleApiCall = async (option: CallOption) => {
    try {
      const payload = {
        callFlowId:
          'TUMspyjWoYb+Ul8vp2khpgWZix3lECvaXcJtTQ78KKK6ZrDHJu7L4PH+3GpdB3h+NZote2LjQdUQy1S9rnLnpLO4EZ0yMMDdK9TZynTxHEU=',
        customerId: 'KWIKTSP_CO_Td9yLftfU903GrIZNyxW',
        callType: 'OUTBOUND',
        callFlowConfiguration: {
          initiateCall_1: {
            callerId: '8048248411',
            mergingStrategy: 'SEQUENTIAL',
            participants: [
              {
                participantAddress: phoneNumber || '',
                callerId: '8048248411',
                participantName: 'abc',
                maxRetries: 1,
                maxTime: 360,
              },
            ],
            maxTime: 360,
          },
          addParticipant_1: {
            mergingStrategy: 'SEQUENTIAL',
            maxTime: 360,
            participants: [
              {
                participantAddress:
                  option === 1 ? '9701646859' : option === 2 ? '9052519059' : '9701646859',
                participantName: 'pqr',
                maxRetries: 1,
                maxTime: 360,
              },
            ],
          },
        },
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: 'Basic c21hcnRlcmJpejotaDcySj92MnZUWEsyV1J4',
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      await response.json();
      Alert.alert('Call Initiated', 'Please wait for the call to connect.');
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate call');
      console.error('API call error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header text="Call Center" />
      <Text style={styles.canteenName}>Welcome to Welfare Canteen Call Center</Text>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: wp('5%'), paddingTop: hp('2%') }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {[1, 2, 3].map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.card,
              {
                backgroundColor:
                  option === 1 ? COLORS.CARD_1 : option === 2 ? COLORS.CARD_2 : COLORS.CARD_3,
              },
            ]}
            onPress={() => handleApiCall(option as CallOption)}
            activeOpacity={0.85}
          >
            <Text style={[styles.label, { color: COLORS.PRIMARY }]}>
              Call Option {option}
            </Text>
            <Text style={styles.cardDescription}>
              {option === 1
                ? 'Customer Support'
                : option === 2
                ? 'Technical Support'
                : 'General Inquiry'}
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.sectionTitle}>Support Guides</Text>
        {VIDEOS.map(video => (
          <View
            key={video.id}
            style={styles.videoCard}
          >
            <YoutubePlayer
              height={hp('25%')}
              width={wp('90%')}
              play={false}
              videoId={video.id}
            />
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoLanguage}>{video.language}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <DownNavbar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  canteenName: {
    color: COLORS.PRIMARY,
    fontSize: wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp('1.5%'),
  },
  card: {
    width: wp('90%'),
    padding: wp('5%'),
    marginVertical: hp('1%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.08,
    shadowRadius: wp('2%'),
    shadowOffset: { width: 0, height: hp('0.2%') },
  },
  label: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
  },
  cardDescription: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
  },
  sectionTitle: {
    color: COLORS.PRIMARY,
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginTop: hp('3%'),
    marginBottom: hp('1.5%'),
    alignSelf: 'flex-start',
  },
  videoCard: {
    width: wp('90%'),
    flexDirection: 'column',
    padding: wp('3%'),
    marginVertical: hp('1%'),
    borderRadius: wp('2.5%'),
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    elevation: 1,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.05,
    shadowRadius: wp('1.5%'),
    shadowOffset: { width: 0, height: hp('0.1%') },
  },
  videoInfo: {
    flex: 1,
    marginTop: hp('1%'),
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  videoLanguage: {
    fontSize: wp('3.5%'),
    color: COLORS.TEXT_SECONDARY,
    marginTop: hp('0.5%'),
  },
});

export default CallCenterScreen;