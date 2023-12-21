import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Modal, Alert} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {Audio} from 'expo-av';
import BarcodeMask from 'react-native-barcode-mask';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getTalonData, useTalon} from '../api/Api';
import { ViewPropTypes } from 'deprecated-react-native-prop-types'

export default function ScannerScreen({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcodeType, setBarcodeType] = useState(BarCodeScanner.Constants.BarCodeType.qr);
    const [scannedResult, setScannedResult] = useState('');
    const [sound, setSound] = useState();
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [activateBarcode, setActivateBarcode] = useState('')
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);


  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    setupSound();
  }, []);

  const setupSound = async () => {
    try {
      if (!sound) {
        const { sound } = await Audio.Sound.createAsync(
          require('../sounds/succes_sound.wav'),
          { shouldPlay: false }
        );
        setSound(sound);
      }
    } catch (error) {
      console.error('Error setting up sound:', error);
      setScanned(false);
    }
  };
  

  const showResultModal = async ({ data }) => {
    try {
      setScanned(true);
      setActivateBarcode(data);
  
      await sound.replayAsync();
  
      const formData = {
        barcode: data,
      };
  
      const response = await getTalonData(formData);
  
      if (response.status === 'success') {
        const talonData = response.data;
        setResultModalVisible(true);
        setModalVisible(true);
  
        if (talonData) {
          console.log('Data:', talonData);
          setFuelType(talonData.nameid_gsm);
          setAzsName(talonData.nameid_azs);
          setAgentName(talonData.nameid_agent);
          setFuelCount(talonData.count);
        } else {
          console.log('Talon is not active.');
        }
      } else if (response.status === 'error') {
        Alert.alert(
          'Ошибка',
          `${response.message}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setScanned(false);
                setActivateBarcode('');
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.error('Server error:', response.message);
        // Handle other cases as needed
      }
    } catch (error) {
      console.error('Error in showResultModal:', error);
      // Reset relevant state variables in case of an error
      setScanned(false);
      setActivateBarcode('');
    }
  };
  

    const closeResultModal = () => {
        setResultModalVisible(false);
        setScanned(false);
        // Reset state variables
        setFuelType('');
        setAzsName('');
        setAgentName('');
        setFuelCount(0);
        setModalVisible(false); // Add this line to hide the modal
    };

  const activateTalon = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log('User data:', userData);

        // Combine user data with scanned data
        const formData = {
          barcode: activateBarcode,
          userid: userData.codeid,
          azs: userData.azs,
        };
        console.log(formData);


        const activationResponse =  await useTalon(formData)

        console.log(activateBarcode);
        
        if (activationResponse.status === 'succes') {
            await sound.replayAsync();
            setScanned(false);
            setActivateBarcode('');
            setTimeout(() => {
            setSuccessMessageVisible(true);
            setTimeout(() => {
              setSuccessMessageVisible(false);
              closeResultModal();
              navigation.navigate('Жыйынтыктар(Отчет)');
            }, 2000);
          }, 0);
        } else {
          console.error('Activation error:', activationResponse.message);
          Alert.alert(
            'Ошибка',
            `${activationResponse.message}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  setScanned(false);
                  setActivateBarcode('');
                },
              },
            ],
            { cancelable: false }
          );
        }
      }
    } catch (error) {
      console.error('Error sending activation request:', error);
      setScanned(false);
      setActivateBarcode('');
    }
  };




  const [fuelType, setFuelType] = useState('');
    const [azsName, setAzsName] = useState('');
    const [agentName, setAgentName] = useState('');
    const [fuelCount, setFuelCount] = useState(0);

    const handleBarCodeScanned = async ({ data }) => {
        try {
          setScanned(true);
          setScannedResult(data);
      
          if (sound) {
            await sound.replayAsync(); 
          }
      
          console.log(`Bar code with data ${data} has been scanned!`);
      
          await showResultModal({ data });
        } catch (error) {
          console.error('Error handling scanned data:', error);
        }
      };
      

    const toggleBarcodeType = () => {
        console.log('Toggling barcode type');
        setBarcodeType((prevType) =>
            prevType === BarCodeScanner.Constants.BarCodeType.qr
                ? BarCodeScanner.Constants.BarCodeType.barcode
                : BarCodeScanner.Constants.BarCodeType.qr
        );
    };

    const closeErrorModal = () => {
        setErrorModalVisible(false);
    };

    if (hasPermission === null) {
        return <Text>Requesting camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : showResultModal}
                style={StyleSheet.absoluteFillObject}>
                <BarcodeMask
                    key={barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 'qr' : 'barcode'}
                    edgeColor={'#62B1F6'}
                    edgeRadius={10}
                    width={barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 300 : 350}
                    height={barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 300 : 150}
                    showAnimatedLine={true}
                    edgeBorderWidth={barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 2 : 1}
                />
            </BarCodeScanner>

            <TouchableOpacity style={styles.toggleButton} onPress={toggleBarcodeType}>
                <Text style={styles.toggleText}>
                    Режим : {barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 'QR код' : 'Штрих код'}
                </Text>
            </TouchableOpacity>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeResultModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                      {successMessageVisible && (
                          <View style={styles.successMessage}>
                            {}
                            <Text style={{ color: 'green' }}>✅ Активировано!</Text>
                          </View>
                      )}

                        <Text style={styles.resultText}>Данные о толоне:</Text>
                        <Text style={styles.resultValue}>Топливо: {fuelType}</Text>
                        <Text style={styles.resultValue}>Агент: {agentName}</Text>
                        <Text style={styles.resultValue}>Количество топлива: {fuelCount} литров</Text>
                        <TouchableOpacity
                            style={styles.activateButton}
                            onPress={activateTalon}
                        >
                            <Text style={styles.activateButtonText}>Активировать</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.closeButton} // Add your styles for the close button
                            onPress={closeResultModal}
                        >
                            <Text style={styles.closeButtonText}>Закрыть</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


        </View>
    );
}

const styles = StyleSheet.create({
  successMessage: {
    backgroundColor: '#dff0d8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        //alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    activateButton: {
        backgroundColor: '#62B1F6',
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '70%',
        position: 'relative',
    },
    toggleButton: {
        position: 'absolute',
        backgroundColor: '#62B1F6',
        padding: 10,
        borderRadius: 5,
        bottom: 80,
    },
    toggleText: {
        color: 'white',
    },
    btn_down: {
        position: 'absolute',
        bottom: 705,
        backgroundColor: '#62B1F6',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        height: '7%',
    },
    btn_down_content: {
        padding: '2px',
        borderRadius: '6px',
        backgroundColor: 'white',
    },
    history_img: {
        width: '24px',
        height: '24px',
    },
    scanner_img: {
        width: '24px',
        height: '24px',
    },
    resultValue: {
        fontSize: 16,
        marginBottom: 15,
    },
    closeButton: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    closeButtonText: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },

});
