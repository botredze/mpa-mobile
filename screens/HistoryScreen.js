import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import scannerImg from '../assets/scanner.png';
import historyImg from '../assets/history.png';


export default function HistoryScreen ()
{
    const toHistory = () =>
    {
        navigation.navigate( 'HistoryScreen' );
    };

    return (
        <View style={ styles.container }>
            <View style={ styles.btn_down }>
                <TouchableOpacity style={ styles.btn_down_content }>
                    {/* <Image source={ scannerImg } style={ styles.scanner_img } /> */ }
                </TouchableOpacity>
                <TouchableOpacity style={ styles.btn_down_content } onPress={ toHistory }>
                    {/* <Image source={ historyImg } style={ styles.history_img } /> */ }
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
    },
    btn_down: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#62B1F6',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        flexWrap: 'wrap',
        height: '40px',
    },
    btn_down_content: {
        padding: 2,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 6,
    },
    history_img: {
        width: 24,
        height: 24,
    },
    scanner_img: {
        width: 24,
        height: 24,
    },
} );
