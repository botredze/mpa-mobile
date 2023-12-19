import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const HomeScreen = () => {
    const [tableData, setTableData] = useState([
        ['Barcode', 'Activation Date'],
        ['123456', '2023-01-01'],
        ['789012', '2023-01-02'],
        // Add more rows as needed
    ]);

    const filterData = (days) => {
        const filteredData = tableData.filter((row, index) => index === 0 );
        setTableData(filteredData);
    };

    const renderButtons = () => {
        const buttons = [
            { label: 'За сегодня', days: 1 },
            { label: 'Вчера', days: 2 },
            { label: 'Последние 3 дня', days: 3 },
            { label: 'Последние 7 дней', days: 7 },
        ];

        return buttons.map((button) => (
            <TouchableOpacity
                key={button.label}
                style={styles.button}
                onPress={() => filterData(button.days)}
            >
                <Text style={styles.buttonText}>{button.label}</Text>
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>{renderButtons()}</View>

            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                <Row data={tableData[0]} style={styles.head} textStyle={styles.text} />
                <Rows data={tableData.slice(1)} textStyle={styles.text} />
            </Table>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#284FFB',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
});

export default HomeScreen;
