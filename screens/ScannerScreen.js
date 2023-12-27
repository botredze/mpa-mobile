import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Modal, Alert} from 'react-native';
import {Camera} from 'expo-camera';
import {Audio} from 'expo-av';
import {BarCodeScanner} from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getTalonData, useTalon} from '../api/Api';

export default function ScannerScreen({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcodeType, setBarcodeType] = useState(BarCodeScanner.Constants.BarCodeType.qr);
    const [sound, setSound] = useState();
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [activateBarcode, setActivateBarcode] = useState('');
    const [successMessageVisible, setSuccessMessageVisible] = useState(false);
    const cameraRef = useRef(null);
    const [login, setLogin] = useState('');

    const [userId, setUserID] = useState('');

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        setupSound();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setScanned(false);
            setHasPermission(false);
            (async () => {
                const {status} = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
            })();
        });

        return unsubscribe;
    }, [navigation])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    setLogin(userData.login);
                    setUserID(userData.codeid);
                    console.log(userData)
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    const setupSound = async () => {
        try {
            if (!sound) {
                const {sound} = await Audio.Sound.createAsync(
                    require('../sounds/succes_sound.wav'),
                    {shouldPlay: false}
                );
                setSound(sound);
            }
        } catch (error) {
            console.error('Error setting up sound:', error);
            setScanned(false);
        }
    };

    const showResultModal = async ({data}) => {
        try {
            setScanned(true);
            setActivateBarcode(data);

            await sound.replayAsync();

            const formData = {
                barcode: data,
                userid: userId,
                username: login
            }

            console.log(formData)
            const response = await getTalonData(formData);

            console.log(response)
            if (response.status === 'success') {
                const talonData = response.data;

                console.log(talonData)
                setResultModalVisible(true);
                setModalVisible(true);
                if (talonData) {
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
                    {cancelable: false}
                );
            } else {
                console.error('Server error:', response.message);
            }
        } catch (error) {
            console.error('Error in showResultModal:', error);
            setScanned(false);
            setActivateBarcode('');
        }
    };

    const closeResultModal = () => {
        setResultModalVisible(false);
        setScanned(false);
        setFuelType('');
        setAzsName('');
        setAgentName('');
        setFuelCount(0);
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
                    await sound.replayAsync();
                    setActivateBarcode('');
                    setTimeout(() => {
                        setSuccessMessageVisible(true);
                        setTimeout(() => {
                            setSuccessMessageVisible(false);
                            setScanned(false);
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
                        {cancelable: false}
                    );
                }
            }
            setScanned(false);
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

    const toggleBarcodeType = () => {
        setScanned(false);
        setHasPermission(true);
        setBarcodeType((prevType) =>
            prevType === BarCodeScanner.Constants.BarCodeType.qr
                ? BarCodeScanner.Constants.BarCodeType.barcode
                : BarCodeScanner.Constants.BarCodeType.qr
        );
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
            <Text style={styles.title}>Requesting camera permission</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No access to camera</Text>
            </View>)
    }

    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                onBarCodeScanned={scanned ? undefined : showResultModal}
                style={StyleSheet.absoluteFillObject}
            >
                <BarcodeMask
                    type={barcodeType}
                    edgeColor={'#62B1F6'}
                    edgeRadius={10}
                    width={barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 300 : 350}
                    height={barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 300 : 150}
                    animatedLineColor={'#f32a2a'}
                    animatedLineHeight={2}
                    animatedLineWidth={'97%'}
                    showAnimatedLine={true}
                />
            </Camera>

            <TouchableOpacity style={styles.toggleButton} onPress={toggleBarcodeType}>
                <Text style={styles.toggleText}>
                    Режим : {barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 'QR код' : 'Штрих код'}
                </Text>
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeResultModal}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {successMessageVisible && (
                            <View style={styles.successMessage}>
                                <Text style={{color: 'green'}}>✅ Активировано!</Text>
                            </View>
                        )}

                        <Text style={styles.resultText}>Данные о толоне:</Text>
                        <Text style={styles.resultValue}>ГСМ: {fuelType}</Text>
                        <Text style={styles.resultValue}>Агент: {agentName}</Text>
                        <Text style={styles.resultValue}>Номинал: {fuelCount} литров</Text>
                        <TouchableOpacity style={styles.activateButton} onPress={activateTalon}>
                            <Text style={styles.activateButtonText}>Активировать</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={closeResultModal}>
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
        marginBottom: 5,
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

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        fontSize: 20,
    },
});
