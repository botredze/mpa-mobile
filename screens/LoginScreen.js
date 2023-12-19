import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import { loginUser } from '../api/Api';

const LoginScreen = () =>
{
    const navigation = useNavigation();

    const [ login, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );

    const handleLogin = async () =>
    {
        const formData = {
            login: login,
            password: password,
        };
        try
        {
            const response = await loginUser( formData );
            console.log( 'Успешный ответ:', response.status );
            await AsyncStorage.setItem( 'login', login );
            await AsyncStorage.setItem( 'password', password );
            if ( response.status === 'succes' )
            {
                navigation.navigate( 'scanner' );
            } else
            {
                navigation.navigate( 'login' );
            }
        } catch ( error )
        {
            console.error( 'Ошибка запроса:', error.message );
        }
    };

    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>Вход</Text>

            <TextInput
                style={ styles.input }
                placeholder="Имя"
                value={ login }
                onChangeText={ ( text ) => setEmail( text ) }
            />

            <TextInput
                style={ styles.input }
                placeholder="Пароль"
                secureTextEntry
                value={ password }
                onChangeText={ ( text ) => setPassword( text ) }
            />

            <TouchableOpacity style={ styles.button } onPress={ handleLogin }>
                <Text style={ styles.buttonText }>Войти</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create( {
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
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 6,
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
} );

export default LoginScreen;
