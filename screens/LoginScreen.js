import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { loginUser } from '../api/Api';

const LoginScreen = () => {
    const navigation = useNavigation();

    const [pin1, setPin1] = useState('');
    const [pin2, setPin2] = useState('');
    const [pin3, setPin3] = useState('');
    const [pin4, setPin4] = useState('');

    const handlePinChange = (pin, nextInput, prevInput) => {
        if (pin.length === 1) {
            // Move focus to the next input
            nextInput && nextInput.focus();
        } else if (pin.length === 0) {
            // Move focus to the previous input
            prevInput && prevInput.focus();
        }
    };

    const handleLogin = async () => {
        const pinCode = pin1 + pin2 + pin3 + pin4;

        // Validate the PIN code (4 digits)
        if (pinCode.length !== 4 || !/^\d+$/.test(pinCode)) {
            console.error('Invalid PIN code');
            return;
        }

        const formData = {
            pinCode: pinCode,
        };

        try {
            const response = await loginUser(formData);
            console.log('Successful response:', response.status);

            // Save the PIN code to AsyncStorage
            await AsyncStorage.setItem('pinCode', pinCode);

            if (response.status === 'success') {
                navigation.navigate('scanner');
            } else {
                navigation.navigate('login');
            }
        } catch (error) {
            console.error('Request error:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.pinContainer}>
                <TextInput
                    style={styles.pinInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={pin1}
                    onChangeText={(text) => { setPin1(text); handlePinChange(text, pin2Ref, null); }}
                    ref={(input) => { pin1Ref = input; }}
                />
                <TextInput
                    style={styles.pinInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={pin2}
                    onChangeText={(text) => { setPin2(text); handlePinChange(text, pin3Ref, pin1Ref); }}
                    ref={(input) => { pin2Ref = input; }}
                />
                <TextInput
                    style={styles.pinInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={pin3}
                    onChangeText={(text) => { setPin3(text); handlePinChange(text, pin4Ref, pin2Ref); }}
                    ref={(input) => { pin3Ref = input; }}
                />
                <TextInput
                    style={styles.pinInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={pin4}
                    onChangeText={(text) => { setPin4(text); handlePinChange(text, null, pin3Ref); }}
                    ref={(input) => { pin4Ref = input; }}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginBottom: 15, // Adjust this value to increase or decrease the vertical spacing
    },
    pinInput: {
        height: 40,
        width: '20%',
        borderColor: 'gray',
        borderWidth: 1,
        textAlign: 'center',
        borderRadius: 6,
        fontSize: 20,
        marginBottom: 15, // Adjust this value to increase or decrease the vertical spacing
    },
    button: {
        backgroundColor: '#284FFB',
        padding: 10,
        borderRadius: 5,
        width: '100%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default LoginScreen;
