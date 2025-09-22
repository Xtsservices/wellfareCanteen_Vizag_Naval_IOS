import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Alert,
  BackHandler,
  Animated,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {Login, ResendOtp, VerifyOtp} from './services/restApi';
import {jwtDecode} from 'jwt-decode';
import {useDispatch} from 'react-redux';
const logo = require('./imgs/worldtek.png');


type RootStackParamList = {
  SelectCanteen: undefined;
  AdminDashboard: undefined;
  Splash: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'SelectCanteen'>;

type JwtPayload = {
  exp?: number;
  [key: string]: any;
};

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  const otpInputs = useRef<Array<TextInput | null>>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const phoneInputRef = useRef<TextInput>(null);
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const otpContainerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (otpSent) {
      Animated.timing(otpContainerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [otpSent]);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const checkTokenValidity = async () => {
        const token = await AsyncStorage.getItem('authorization');
        console.log('token==============', token);
        if (token) {
          try {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp > currentTime) {
              setLoading(true);
              navigation.navigate('SelectCanteen');
            } else {
              navigation.navigate('Splash' as never);
            }
          } catch (error) {
            setLoading(true);
            console.error('Invalid token:', error);
            navigation.navigate('Splash' as never);
          }
        } else {
          setLoading(false);
        }
      };
      checkTokenValidity();
    }, [navigation]),
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (otpSent) {
      setShowResend(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < otp.length - 1) {
      otpInputs.current[index + 1]?.focus();
    } else if (value === '' && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const validatePhoneNumber = (number: string) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    Toast.show({
      type,
      text1: message,
      position: 'top',
    });
  };

  const handlePhoneInputFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 200,
        animated: true,
      });
    }, 100);
  };

  // New function to handle changing phone number
  const handleChangeNumber = () => {
    setOtpSent(false);
    setOtp(['', '', '', '', '', '']);
    setTimer(60);
    setShowResend(false);
    setPhoneNumber('');
    // Focus on phone input after a small delay
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 300);
  };

  const sendOtp = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      showToast(
        'error',
        'Invalid phone number. Enter a valid 10-digit number.',
      );
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(Login(), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mobile: phoneNumber}),
      });

      if (response.ok) {
        showToast('success', 'OTP sent successfully.');
        setOtpSent(true);
        setTimer(60);
        setShowResend(false);
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: 400,
            animated: true,
          });
        }, 500);
      } else {
        showToast('error', 'Failed to send OTP. Try again.');
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      showToast('error', 'Network error. Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      showToast('error', 'Enter the full 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(VerifyOtp(), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mobile: phoneNumber, otp: enteredOtp}),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'OTP verified successfully.');
        await AsyncStorage.setItem('authorization', data.token);
        await AsyncStorage.setItem('phoneNumber', phoneNumber);
        dispatch({type: 'currentUserData', payload: data.data});

        navigation.navigate('SelectCanteen');
      } else {
        showToast('error', `Invalid OTP: ${data.message || 'Try again.'}`);
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      showToast('error', 'Network error. Could not verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(ResendOtp(), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mobile: phoneNumber}),
      });

      if (response.ok) {
        showToast('success', 'OTP resent successfully.');
        setTimer(60);
        setShowResend(false);
      } else {
        showToast('error', 'Failed to resend OTP. Try again.');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      showToast('error', 'Network error. Could not resend OTP.');
    } finally {
      setLoading(false);
    }
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#010080" barStyle="light-content" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{translateY: slideAnim}],
              }
            ]}
          >
            <Animated.View 
              style={[
                styles.logoContainer,
                {
                  transform: [{scale: scaleAnim}],
                }
              ]}
            >
              <View style={styles.logoIconContainer}>
                <Text style={styles.logoIcon}>🍽️</Text>
              </View>
              <Text style={styles.logoText}>Welfare Canteen</Text>
            </Animated.View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Login or Sign up</Text>
              <Text style={styles.subtitle}>We'll send you a verification code</Text>

              {/* Phone Number Section - Show only if OTP not sent */}
              {!otpSent && (
                <>
                  <View style={styles.inputContainer}>
                    <View style={styles.countryCode}>
                      <Text style={styles.flag}>🇮🇳</Text>
                      <Text style={styles.codeText}>+91</Text>
                    </View>
                    <TextInput
                      ref={phoneInputRef}
                      style={styles.phoneInput}
                      placeholder="Enter your phone number"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      maxLength={10}
                      returnKeyType="done"
                      onFocus={handlePhoneInputFocus}
                      autoComplete="tel"
                      textContentType="telephoneNumber"
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.confirmButton, loading && styles.buttonDisabled]}
                    onPress={sendOtp}
                    disabled={loading}
                    activeOpacity={0.8}>
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.confirmText}>Get OTP</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}

              {/* OTP Section */}
              {otpSent && (
                <Animated.View 
                  style={[
                    styles.otpSection,
                    {
                      opacity: otpContainerAnim,
                      transform: [{translateY: Animated.multiply(otpContainerAnim, -10)}],
                    }
                  ]}
                >
                  <Text style={styles.otpLabel}>Enter Verification Code</Text>
                  <View style={styles.phoneNumberDisplay}>
                    <Text style={styles.otpSubtext}>
                      We sent a 6-digit code to +91 {phoneNumber}
                    </Text>
                    <TouchableOpacity onPress={handleChangeNumber} style={styles.changeNumberButton}>
                      <Text style={styles.changeNumberText}>Change Number</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <View key={index} style={styles.otpInputWrapper}>
                        <TextInput
                          ref={ref => {
                            otpInputs.current[index] = ref;
                          }}
                          style={[
                            styles.otpInput,
                            digit ? styles.otpInputFilled : null,
                          ]}
                          keyboardType="number-pad"
                          maxLength={1}
                          value={digit}
                          onChangeText={value => handleOtpChange(value, index)}
                          onKeyPress={e => handleKeyPress(e, index)}
                          textAlign="center"
                          returnKeyType="done"
                        />
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.confirmButton, loading && styles.buttonDisabled]}
                    onPress={verifyOtp}
                    disabled={loading}
                    activeOpacity={0.8}>
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.confirmText}>Verify OTP</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.resendContainer}>
                    {showResend ? (
                      <TouchableOpacity
                        style={styles.resendButton}
                        onPress={resendOtp}
                        disabled={loading}
                        activeOpacity={0.7}>
                        {loading ? (
                          <ActivityIndicator color="#010080" size="small" />
                        ) : (
                          <Text style={styles.resendText}>Resend OTP</Text>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.timerText}>
                        Resend code in {timer}s
                      </Text>
                    )}
                  </View>
                </Animated.View>
              )}
            </View>
          </Animated.View>
        </ScrollView>
        
        <View style={styles.poweredByContainer}>
          <Text style={styles.poweredByText}>Powered by</Text>
          <Image
            source={logo}
            style={styles.poweredByLogo}
            resizeMode="contain"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#010080',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoIcon: {
    fontSize: 36,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#010080',
    textAlign: 'center',
    marginBottom: 5,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    height: 50,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  flag: {
    fontSize: 16,
    marginRight: 6,
  },
  codeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 0,
    color: '#333',
    height: '100%',
  },
  confirmButton: {
    backgroundColor: '#010080',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#010080',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    height: 50,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpSection: {
    marginTop: 10,
  },
  otpLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneNumberDisplay: {
    alignItems: 'center',
    marginBottom: 25,
  },
  otpSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  changeNumberButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  changeNumberText: {
    fontSize: 14,
    color: '#010080',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  otpInputWrapper: {
    marginHorizontal: 6, // Add gap between OTP boxes
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 'bold',
    width: 45,
    height: 55,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  otpInputFilled: {
    borderColor: '#010080',
    backgroundColor: '#fff',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  resendText: {
    color: '#010080',
    fontSize: 14,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 14,
    color: '#666',
  },
  poweredByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  poweredByText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  poweredByLogo: {
    width: 120,
    height: 35,
  },
});

export default LoginScreen;
