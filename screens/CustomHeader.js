import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { getTalonData, useTalon } from "../api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const NumberInputScreen = () => {
  const navigation = useNavigation();

  const [number, setNumber] = useState('');
  const [activateBarcode, setActivateBarcode] = useState('');
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [fuelType, setFuelType] = useState('');
  const [azsName, setAzsName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [fuelCount, setFuelCount] = useState(0);
  const [login, setLogin] = useState('');
  const [userId, setUserID] = useState('');

  const handleNumberChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    setNumber(cleanedText);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setLogin(userData.login);
          setUserID(userData.codeid)
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);


  const handleClearInput = () => {
    setNumber('');
    Keyboard.dismiss();
    setModalVisible(false);
  };

  const activateTalon = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);

        const formData = {
          barcode: activateBarcode,
          userid: userId,
          azs: userData.azs,
          username: login
        };

        const activationResponse = await useTalon(formData);

        if (activationResponse.status === 'success') {
          handleClearInput();
          setTimeout(() => {
            setSuccessMessageVisible(true);
            setModalVisible(false);
            setTimeout(() => {
              setSuccessMessageVisible(false);
              navigation.navigate('Жыйынтыктар(Отчет)');
            }, 2000);
          }, 0);
        } else {
          console.error('Activation error:', activationResponse.message);
          Alert.alert(
              'Ошибка',
              `${activationResponse.message }` + '/n' +`Штрих код: ${number}`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                  },
                },
              ],
              { cancelable: false }
          );
        }
      }
    } catch (error) {
      console.error('Error sending activation request:', error);
    }
  };

  const showResultModal = async () => {
    try {
      setActivateBarcode(number);
     // Keyboard.dismiss();
      const formData = {
        barcode: number,
        username: login,
        userid: userId,
      };

      const response = await getTalonData(formData);

      if (response.status === 'success') {
        const talonData = response.data;
        setModalVisible(true);

        if (talonData) {
          setFuelType(talonData.nameid_gsm);
          setAzsName(talonData.nameid_azs);
          setAgentName(talonData.nameid_agent);
          setFuelCount(talonData.count);
        }

      } else if (response.status === 'error') {
        Alert.alert(
            'Ошибка',
            `${response.message}`+ ' ' +`Штрих код: ${number}`,
            [{text: "ОК", onPress: () => handleClearInput() }],
            { cancelable: false }
        );
        console.log('Хуй хуй', response.error, `Штрих код: ${number}`)
        //handleClearInput()
      } else {
        console.error('Server error:', response.message);
      }
    } catch (error) {
      console.error('Error in showResultModal:', error);
    }
  };

  return (
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 25 : 0}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Ручная проводка</Text>

          <View style={styles.inputContainer}>
            <TextInput
                placeholder={'Введите штрих код'}
                style={styles.input}
                keyboardType="number-pad"
                value={number}
                onChangeText={handleNumberChange}
            />

            <TouchableOpacity style={styles.clearButton} onPress={handleClearInput}>
              <Text style={styles.cancelText}>X</Text>
            </TouchableOpacity>
          </View>

          {modalVisible && (
              <View style={styles.resultContainer}>

                {successMessageVisible && (
                    <View style={styles.successMessage}>
                      <Text style={{ color: 'green' }}>✅ Активировано!</Text>
                    </View>
                )}

                <Text style={styles.resultText}>Данные о талоне:</Text>
                <Text style={styles.resultValue}>ГСМ: {fuelType}</Text>
                <Text style={styles.resultValue}>Агент: {agentName}</Text>
                <Text style={styles.resultValue}>Номинал: {fuelCount} литров</Text>

                <TouchableOpacity
                    style={styles.activateButton}
                    onPress={activateTalon}
                >
                  <Text style={styles.activateButtonText}>Активировать</Text>
                </TouchableOpacity>
              </View>
          )}


            <TouchableOpacity
                style={[
                    styles.scanButton,
                    Platform.OS === 'ios' ? { bottom: 0 } : null,
                ]}
                onPress={showResultModal}
            >
                <Text style={styles.btnText}>Активировать</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'space-between',
    gap: 10,
    height: 110,
  //  backgroundColor: 'red',
    position: "relative",
    alignItems: "center",
  },

  container: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'start',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    //backgroundColor: 'red',
    position: 'relative'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 60,

    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    width: '70%',
   // marginBottom: 20,
    ...Platform.select({
      ios: {
        borderBottomWidth: 1,
      },
      android: {},
    }),
  },
  clearButton: {
    backgroundColor: '#f34f4f',
    //padding: 5,
    borderRadius: 9,
   // marginBottom: 20,
    height: 40,
    width: 45,
    alignItems: "center"
  },

  scanButton: {
    backgroundColor: '#396ad9',
    padding: 10,
    width: '80%',
    height: 50,
    alignItems: 'center',
    borderRadius: 17,
    marginBottom: 20,
    position: 'absolute',
    bottom: 0
  },

  btnText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold'
  },
  successMessage: {
    backgroundColor: '#dff0d8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  resultContainer: {
    backgroundColor: 'rgba(255,255,255,0.42)',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 16,
    marginBottom: 15,
  },
  activateButton: {
    backgroundColor: '#396AD9FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 5
  },
  activateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  cancelText: {
    color: 'white',
    fontSize:  35,
    lineHeight: 40,
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold'
  }

});

export default NumberInputScreen;
