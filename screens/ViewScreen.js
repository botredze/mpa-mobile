import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ViewScreen = (props) => {
    const { route } = props;
    const scannedResult = route?.params?.result?.data?.scannedResult || 'No result';
    const message = route?.params?.result?.data?.message || 'No result';
    return (
        <View style={styles.container}>
            <Text style={styles.resultText}>
                Результат сканирования: {scannedResult}
            </Text>

            <Text style={styles.resultText}>
                Server message: {message}
            </Text>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Background color similar to Material-UI
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 20,
    },
});

export default ViewScreen;
