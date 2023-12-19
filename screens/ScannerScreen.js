// ScannerScreen.js
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Audio } from 'expo-av';
import BarcodeMask from 'react-native-barcode-mask';
import ViewScreen from './ViewScreen';
import ErrorModal from './ErrorModal';

import scannerImg from '../assets/scanner.png';
import historyImg from '../assets/history.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ScannerScreen ( { navigation } )
{
  const [ hasPermission, setHasPermission ] = useState( null );
  const [ scanned, setScanned ] = useState( false );
  const [ barcodeType, setBarcodeType ] = useState( BarCodeScanner.Constants.BarCodeType.qr );
  const [ scannedResult, setScannedResult ] = useState( '' );
  const [ sound, setSound ] = useState();
  const [ errorModalVisible, setErrorModalVisible ] = useState( false );
  const [ errorMessage, setErrorMessage ] = useState( '' );

  useEffect( () =>
  {
    ( async () =>
    {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission( status === 'granted' );
    } )();

    setupSound(); // Setup sound asynchronously
  }, [] );

  const setupSound = async () =>
  {
    const { sound } = await Audio.Sound.createAsync( require( '../sounds/succes_sound.wav' ) );
    setSound( sound );
  };

  const handleBarCodeScanned = async ( { data } ) =>
  {
    setScanned( true );
    setScannedResult( data );

    if ( sound )
    {
      await sound.replayAsync(); // Replay the sound
    }

    console.log( `Bar code with data ${ data } has been scanned!` );

    try
    {
      const response = await fetch( 'http://192.168.1.15:3000/carty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( { scannedResult: data } ),
      } );

      if ( response.ok )
      {
        const result = await response.json();
        console.log( result );
        navigation.navigate( 'ViewScreen', { result } );
      } else
      {
        const errorMessage = await response.text();
        console.error( 'Server error:', errorMessage );

        setErrorMessage( errorMessage );
        setErrorModalVisible( true );
      }

    } catch ( error )
    {
      console.error( 'Error sending POST request:', error );
      setErrorMessage( 'An unexpected error occurred.' );
      setErrorModalVisible( true );
    }
  };


  const toggleBarcodeType = () =>
  {
    console.log( 'Toggling barcode type' );
    setBarcodeType( ( prevType ) =>
      prevType === BarCodeScanner.Constants.BarCodeType.qr
        ? BarCodeScanner.Constants.BarCodeType.barcode
        : BarCodeScanner.Constants.BarCodeType.qr
    );
  };

  const closeErrorModal = () =>
  {
    setErrorModalVisible( false );
  };

  if ( hasPermission === null )
  {
    return <Text>Requesting camera permission</Text>;
  }
  if ( hasPermission === false )
  {
    return <Text>No access to camera</Text>;
  }

  // If scanned, navigate to ViewScreen and pass the scanned result as a parameter
  if ( scanned )
  {
    return <ViewScreen scannedResult={ scannedResult } />;
  }


  const toHistory = () =>
  {
    navigation.navigate( 'HistoryScreen' );
  };

  const getStoredCredentials = async () =>
  {
    try
    {
      const login = await AsyncStorage.getItem( 'login' );
      const password = await AsyncStorage.getItem( 'password' );

      console.log( login );
      console.log( password );
    } catch ( error )
    {
      console.error( 'Ошибка при получении данных:', error );
    }
  };

  // Вызовите эту функцию, когда компонент загружается или при запуске приложения
  getStoredCredentials();

  return (
    <View style={ styles.container }>
      <BarCodeScanner
        onBarCodeScanned={ scanned ? undefined : handleBarCodeScanned }
        style={ StyleSheet.absoluteFillObject }>
        <BarcodeMask
          key={ barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 'qr' : 'barcode' }
          edgeColor={ '#62B1F6' }
          edgeRadius={ 10 }
          width={ barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 300 : 350 }
          height={ barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 300 : 150 }
          showAnimatedLine={ true }
          edgeBorderWidth={ barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 2 : 1 }
        />
      </BarCodeScanner>

      <TouchableOpacity style={ styles.toggleButton } onPress={ toggleBarcodeType }>
        <Text style={ styles.toggleText }>
          Режим : { barcodeType === BarCodeScanner.Constants.BarCodeType.qr ? 'QR Code' : 'Barcode' }
        </Text>
      </TouchableOpacity>

      <View style={ styles.btn_down }>
        <TouchableOpacity style={ styles.btn_down_content }>
          <Image source={ scannerImg } style={ styles.scanner_img } />
        </TouchableOpacity>
        <TouchableOpacity style={ styles.btn_down_content } onPress={ toHistory }>
          <Image source={ historyImg } style={ styles.history_img } />
        </TouchableOpacity>
      </View>

      <ErrorModal
        isVisible={ errorModalVisible }
        errorMessage={ errorMessage }
        onClose={ closeErrorModal }
      />
    </View>

  );
}

const styles = StyleSheet.create( {
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
  }
} );
