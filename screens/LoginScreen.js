import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback, Image, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import CustomPinKeyboard from './CustomPinKeyboard';
import { LogBox } from 'react-native';
import logoImage from '../assets/logo-mpa.png';

import { loginUser } from '../api/Api';
import {LinearGradient} from "expo-linear-gradient";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [code, setCode] = useState('');

  const handleLogin = async () => {
    if (code.length > 3 || code.length === 4 && /^\d+$/.test(code)) {
        const pincode = code.slice(0, 4)
      const formData = {
        pin: pincode,
      };

      try {
        const response = await loginUser(formData);

        if (response.status === 'success') {
          const userData = response.data[0];

          await AsyncStorage.setItem('userData', JSON.stringify(userData));

          console.log('Successful response:', response.status);
          navigation.replace('HomeTabs');
        } else {
          console.error('Login failed:', response.message);
          Alert.alert('Ошибка авторизации', 'Пин не найден');
          setCode('')
        }
      } catch (error) {
        console.error('Request error:', error.message);
      }
    }
  };

  const handleBackspace = () => {
    setCode((prevCode) => prevCode.slice(0, -1));
  };

  console.log(code);

  if(code.length === 4){
    handleLogin();
  };

  const handleKeyPress = (value) => {
    if (value === 'OK') {
      handleLogin();
    } else {
      setCode((prevCode) => (value === '←' ? prevCode.slice(0, -1) : prevCode + value));
    }
  };

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <LinearGradient
              colors={['#1b55a4', '#1b55a4']} // Задайте два цвета для градиента
              style={styles.gradientContainer}
          >
            {/* Ваш существующий код */}
            <Image source={logoImage} style={styles.logo} resizeMode="contain" />

            <SmoothPinCodeInput
                cellStyle={{
                  borderBottomWidth: 3,
                  borderColor: 'white',
                  width: 40,
                  height: 40,
                  marginHorizontal: 10,
                }}
                cellStyleFocused={{
                  borderColor: 'black',
                }}
                textProps={{
                  style: {
                    fontSize: 35,
                    color: 'white',
                    textAlign: 'center',
                  },
                }}
                textStyle={{
                  fontSize: 30,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                value={code}
                onTextChange={(code) => {

                  setCode(code);
                  onFulfill(code)
                  if (code.length === 3) {
                    handleLogin();
                  }
                }

                }
                codeLength={4} // Set the code length to 4
            />


            <View style={styles.keyboardContainer}>
              <CustomPinKeyboard onPress={handleKeyPress} onBackspace={handleBackspace} />
            </View>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
  //  marginTop: 150,
    width: '100%',
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    //marginTop: 150,
  },
  logo: {
    //backgroundColor: 'white',
   // display: 'block',
    width: 230,
    height: 230,
    marginBottom: 16,
    marginTop: 50
  },
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   padding: 16,
  //   marginTop: 150,
  // },
  // logo: {
  //   width: 130, // Adjust width as needed
  //   height: 130, // Adjust height as needed
  //   marginBottom: 16,
  // },
  title: {
    fontSize: 34,
    marginBottom: 16,
  },
  keyboardContainer: {
    marginTop: 20,
  },
});

const ignoreWarns = [
  'EventEmitter.removeListener',
  '[fuego-swr-keys-from-collection-path]',
  'Setting a timer for a long period of time',
  'ViewPropTypes will be removed from React Native',
  'AsyncStorage has been extracted from react-native',
  "exported from 'deprecated-react-native-prop-types'.",
  'Non-serializable values were found in the navigation state.',
  'VirtualizedLists should never be nested inside plain ScrollViews',
];

LogBox.ignoreLogs(ignoreWarns);
export default LoginScreen;
