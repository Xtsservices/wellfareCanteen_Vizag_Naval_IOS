import React, {useEffect} from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {NavigationContainer, NavigationProp} from '@react-navigation/native';

type RootStackParamList = {
  Login: undefined;
};

const HomePage = ({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList>;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login' as never);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* <Image
        source={{
          uri: '',
        }}
        style={styles.image}
        resizeMode="contain"
      /> */}
      <View style={{marginTop: 30, alignItems: 'center', width: '90%'}}></View>
      <Text
        style={{
          color: '#fff',
          fontSize: 32,
          fontWeight: 'bold',
          letterSpacing: 1,
          textAlign: 'center',
        }}>
        Welcome to
      </Text>
      <Text
        style={{
          color: '#FFD700',
          fontSize: 36,
          fontWeight: 'bold',
          marginTop: 10,
          textAlign: 'center',
          textShadowColor: '#000',
          textShadowOffset: {width: 2, height: 2},
          textShadowRadius: 4,
        }}>
        Welfare Canteen
      </Text>
      <View
        style={{
          height: 4,
          backgroundColor: '#FFD700',
          width: 80,
          borderRadius: 2,
          marginTop: 16,
        }}
      />
      <Text
        style={{
          color: '#fff',
          fontSize: 16,
          marginTop: 24,
          textAlign: 'center',
          opacity: 0.8,
        }}>
        Serving those who serve the nation
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default HomePage;
