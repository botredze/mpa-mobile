import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getUsedTalons } from "../api/Api";
import {PanGestureHandler, State} from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";

const HomeScreen = () => {
    const navigation = useNavigation();
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        // Fetch initial data when the component mounts
        fetchData();
    }, []);

    const fetchData = async () => {
        const formdata = {
            id: 2
        }


        try {
            const response = await getUsedTalons(formdata);

            console.log(response)
            // Assuming response.data contains the array of items
            setTableData(response.data || []);
        } catch (err) {
            console.error('Request error:', err.message);
        }
    };

    const filterData = async (days) => {
        try {
            const formdata = {
                id: 2, // Replace with the actual value
                dateRange: days
            };

            const response = await getUsedTalons(formdata);

            // Assuming response.data contains the array of items
            setTableData(response.data || []);
        } catch (err) {
            console.error('Request error:', err.message);
        }
    };

    const handleSwipeRight = ({ nativeEvent }) => {
        console.log('HUI HUI HUI hui ')
            navigation.navigate('scanner');
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
        <View style={styles.mainContainer}>
            <PanGestureHandler onGestureEvent={handleSwipeRight}>
                <View style={styles.swipeArea} />
            </PanGestureHandler>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Использованные талоны</Text>
            </View>

            <View style={styles.buttonsContainer}>
                <ScrollView
                    horizontal
                    contentContainerStyle={styles.buttonsContentContainer}
                >
                    {renderButtons()}
                </ScrollView>
            </View>

            {/* Table */}
            <ScrollView style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.tableCellSmall]}>№</Text>
                    <Text style={[styles.tableHeaderText, styles.tableCellSmall]}>АЗС</Text>
                    <Text style={[styles.tableHeaderText, styles.tableCellMedium]}>Код</Text>
                    <Text style={[styles.tableHeaderText, styles.tableCellLarge]}>Дата</Text>
                </View>

                {tableData.map((item, index) => (
                    item.codeid !== null && item.azs !== null && item.barcode !== null && item.date_use !== null && (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.tableCellSmall]}>{item.codeid}</Text>
                            <Text style={[styles.tableCell, styles.tableCellSmall]}>{item.azs}</Text>
                            <Text style={[styles.tableCell, styles.tableCellMedium]}>{item.barcode}</Text>
                            <Text style={[styles.tableCell, styles.tableCellLarge]}>{item.date_use}</Text>
                        </View>
                    )
                ))}
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    tableContainer: {
        marginTop: 10,
        //backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableHeaderText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 12,
       borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
    },
    tableCellSmall: {
        flex: 0.5, // Adjust the width as needed
    },
    tableCellMedium: {
        flex: 1, // Adjust the width as needed
    },
    tableCellLarge: {
        flex: 2, // Adjust the width as needed
    },

    mainContainer: {
        flex: 1,
        padding: 16,
        marginTop: 40,
    },
    headerContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        marginTop: 10,
    },
    buttonsContainer: {
        marginBottom: 16,
    },
    buttonsContentContainer: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#284FFB',
        padding: 10,
        borderRadius: 5,
        marginRight: 12,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    swipeArea: {
        ...StyleSheet.absoluteFillObject,
    },
    listItem: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        margin: 6,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 5,
    },
    text: {
        marginHorizontal: 12,
    },

});

export default HomeScreen;
