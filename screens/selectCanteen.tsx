import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';
import {AllCanteens} from './services/restApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import Header from './header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DownNavbar from './downNavbar';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SelectCanteen'>;

type Canteen = {
  id: string;
  canteenName: string;
  canteenImage: string;
};

const SelectCanteenScreen = () => {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const fetchCanteens = async () => {
    console.log('Fetching canteens...1');
    try {
      setLoading(true);

      const response = await axios.get(AllCanteens());

      console.log('Fetching canteens...', response.data);

      if (response.data && response.data.data) {
        setCanteens(
          response.data.data.map((item: any) => ({
            id: item.id.toString(),
            canteenName: item.canteenName,
            canteenImage: item.canteenImage,
          })),
        );
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCanteens();
    }, []),
  );

  const handleCanteenSelect = (canteenName: string) => {
    setSelectedCanteen(canteenName);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Exit', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        backHandler.remove();
      };
    }, []),
  );

  const handleConfirm = async() => {
    if (selectedCanteen) {
      const selectedCanteenId = canteens.find(
        canteen => canteen.canteenName === selectedCanteen,
      )?.id;
      //set canteenID in async storage
      await AsyncStorage.setItem('canteenId', selectedCanteenId || '');
      if (selectedCanteenId) {
        navigation.navigate('Dashboard', {canteenId: selectedCanteenId});
      }
    }
  };

  const renderCanteenItem = ({item}: {item: Canteen}) => (
    <TouchableOpacity
      style={[
        styles.canteenCard,
        selectedCanteen === item.canteenName && styles.selectedCard,
      ]}
      onPress={() => handleCanteenSelect(item.canteenName)}
      activeOpacity={0.85}>
      <Image
        source={{uri: item.canteenImage}}
        style={styles.canteenImage}
        resizeMode="cover"
      />
      <Text style={styles.canteenName} numberOfLines={2}>
        {item.canteenName}
      </Text>
      {selectedCanteen === item.canteenName && (
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
      <Header text="Welfare Canteen" />

      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Click To Use</Text>
      </View>

      <View style={[
        styles.contentContainer,
        {paddingBottom: selectedCanteen ? hp('12%') : hp('8%')} // Dynamic style here
      ]}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#010080" />
          </View>
        ) : (
          <FlatList
            data={canteens}
            keyExtractor={item => item.id}
            renderItem={renderCanteenItem}
            numColumns={2}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No canteens available</Text>
            }
          />
        )}
      </View>

      {/* Confirm Button - Fixed position above footer */}
      {selectedCanteen && (
        <View style={styles.confirmButtonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm Selection</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer - Fixed at bottom */}
      <DownNavbar style={styles.stickyNavbar} />
    </SafeAreaView>
  );
};

const COLORS = {
  PRIMARY: '#0014A8',
  TEXT_DARK: '#333',
  TEXT_SECONDARY: '#888',
  BACKGROUND: '#F3F6FB',
  BORDER: '#e0e0e0',
  CANCELLED: '#F44336',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: wp('0.1%'),
    borderBottomColor: '#e0e0e0',
    marginBottom: hp('1%'),
    elevation: 2,
    borderBottomLeftRadius: wp('5%'),
    borderBottomRightRadius: wp('5%'),
  },
  headerSubtitle: {
    fontSize: wp('4%'),
    color: '#555',
    fontFamily: 'Poppins',
    marginBottom: hp('0.2%'),
  },
  contentContainer: {
    flex: 1,
    // Dynamic padding will be applied inline
  },
  grid: {
    paddingHorizontal: wp('2%'),
    paddingBottom: hp('2%'),
    alignItems: 'center',
    flexGrow: 1,
  },
  canteenCard: {
    backgroundColor: '#fff',
    borderRadius: wp('4.5%'),
    margin: wp('2%'),
    width: wp('44%'),
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#010080',
    shadowOpacity: 0.1,
    shadowRadius: wp('2.5%'),
    shadowOffset: {width: 0, height: hp('0.5%')},
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('2%'),
    position: 'relative',
    borderWidth: wp('0.2%'),
    borderColor: '#e3e6f3',
  },
  selectedCard: {
    borderWidth: wp('0.4%'),
    borderColor: '#010080',
    shadowOpacity: 0.18,
    shadowColor: '#010080',
    backgroundColor: '#f0f4ff',
    transform: [{scale: 1.02}], // Slight scale for selection feedback
  },
  canteenImage: {
    width: wp('36%'),
    height: wp('36%'),
    borderRadius: wp('3.5%'),
    marginBottom: hp('1.5%'),
    backgroundColor: '#e0e0e0',
  },
  canteenName: {
    color: '#010080',
    fontWeight: '700',
    fontSize: wp('4.2%'),
    textAlign: 'center',
    fontFamily: 'Poppins',
    marginBottom: hp('0.2%'),
    minHeight: hp('5%'),
    letterSpacing: wp('0.05%'),
  },
  checkCircle: {
    position: 'absolute',
    top: hp('1.5%'),
    right: wp('3%'),
    backgroundColor: '#010080',
    borderRadius: wp('7%'),
    width: wp('7%'),
    height: wp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#010080',
    shadowOpacity: 0.3,
    shadowRadius: wp('1%'),
    shadowOffset: {width: 0, height: hp('0.2%')},
  },
  checkMark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('4.5%'),
  },
  confirmButtonContainer: {
    position: 'absolute',
    bottom: hp('10%'), // Position above the footer
    left: 0,
    right: 0,
    backgroundColor: 'rgba(245, 247, 250, 0.95)', // Semi-transparent background
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    borderTopWidth: wp('0.1%'),
    borderTopColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#010080',
    paddingVertical: hp('2%'),
    borderRadius: wp('4%'),
    width: '100%',
    elevation: 6,
    shadowColor: '#010080',
    shadowOpacity: 0.25,
    shadowRadius: wp('3%'),
    shadowOffset: {width: 0, height: hp('0.3%')},
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: wp('4.8%'),
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: wp('0.2%'),
    fontFamily: 'Poppins',
  },
  stickyNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: hp('1.2%'),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: wp('0.2%'),
    borderTopColor: COLORS.BORDER,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
    shadowOffset: {width: 0, height: -hp('0.2%')},
  },
  emptyText: {
    color: '#aaa',
    fontSize: wp('4%'),
    marginTop: hp('7%'),
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectCanteenScreen;
