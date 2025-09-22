import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
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
import {API_BASE_URL} from './services/restApi';
import {useFocusEffect} from '@react-navigation/native';

const COLORS = {
  PRIMARY: '#0014A8',
  TEXT_DARK: '#333',
  TEXT_SECONDARY: '#999',
  BACKGROUND: '#fff',
  TABLE_HEADER: '#f5f5f5',
  BORDER: '#eee',
};

type WalletScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'WalletScreen'
>;

interface WalletScreenProps {
  navigation: WalletScreenNavigationProp;
}

interface Transaction {
  id: number;
  userId: string;
  referenceId: string;
  type: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

const WalletScreen: React.FC<WalletScreenProps> = ({navigation}) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWalletData = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authorization');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: token,
      };

      const res = await fetch(`${API_BASE_URL}/order/getWalletTransactions`, {
        headers,
      });

      if (!res.ok) {
        console.error('Failed to fetch wallet data');
        return;
      }

      const json = await res.json();

      const trans = json.data?.transactions || [];
      const balance = json.data?.walletBalance || 0;

      setTransactions(trans);
      setWalletBalance(balance);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [fetchWalletData]),
  );

  const displayedHistory = showAll ? transactions : transactions.slice(0, 4);



  return (
    <View style={styles.container}>
      <Header text="Wallet Amount" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <>
          <View style={styles.walletCard}>
            <Text style={styles.walletAmount}>{`₹ ${walletBalance}`}</Text>
          </View>
          <ScrollView style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Transactions</Text>
              {transactions.length > 4 && (
                <TouchableOpacity onPress={() => setShowAll(!showAll)}>
                  <Text style={styles.viewAllText}>
                    {showAll ? 'View Less' : 'View All'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {transactions.length === 0 ? (
              <Text style={styles.noTransactionsText}>
                No transactions found
              </Text>
            ) : (
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.headerCell]}>
                    Type
                  </Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>
                    Amount
                  </Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>
                    Reference
                  </Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>
                    Date
                  </Text>
                </View>
                {displayedHistory.map((item: Transaction) => (
                  <View key={item.id} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.type}</Text>
                    <Text style={styles.tableCell}>₹{item.amount}</Text>
                    <Text style={styles.tableCell}>{item.referenceId}</Text>
                    <Text style={styles.tableCell}>
                      {new Date(item.createdAt * 1000).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
          <View style={styles.footer}>
            <Text style={styles.footerText}>proposed by</Text>
            <Image
              source={{uri: 'https://watabix.com/assets/logo.png'}}
              style={styles.footerLogo}
            />
          </View>
        </>
      )}
      <DownNavbar style={styles.stckyNavbar} />
    </View>
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
  walletCard: {
    margin: wp('4%'),
    padding: wp('4%'),
    borderRadius: wp('2.5%'),
    borderWidth: wp('0.2%'),
    borderColor: COLORS.PRIMARY,
    alignItems: 'center',
  },
  walletAmount: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: hp('1%'),
  },
  historySection: {
    flex: 1,
    marginHorizontal: wp('4%'),
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    marginTop: hp('1.5%'),
  },
  historyTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
  },
  viewAllText: {
    color: COLORS.PRIMARY,
    fontSize: wp('3.5%'),
    fontWeight: '500',
  },
  noTransactionsText: {
    fontSize: wp('4%'),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: hp('2%'),
  },
  table: {
    borderWidth: wp('0.2%'),
    borderColor: COLORS.BORDER,
    borderRadius: wp('2%'),
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: wp('0.2%'),
    borderColor: COLORS.BORDER,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('1%'),
  },
  tableHeader: {
    backgroundColor: COLORS.TABLE_HEADER,
  },
  tableCell: {
    flex: 1,
    fontSize: wp('3.2%'),
    color: COLORS.TEXT_DARK,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  footer: {
    alignItems: 'center',
    padding: wp('4%'),
    borderTopWidth: wp('0.2%'),
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.BACKGROUND,
  },
  footerText: {
    fontSize: wp('3%'),
    color: COLORS.TEXT_SECONDARY,
  },
  footerLogo: {
    width: wp('20%'),
    height: hp('2.5%'),
    resizeMode: 'contain',
    marginTop: hp('0.5%'),
  },
  stckyNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default WalletScreen;
