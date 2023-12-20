import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getUsedTalons } from "../api/Api";
import {PanGestureHandler, State} from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ViewPropTypes } from 'deprecated-react-native-prop-types'

const HomeScreen = () => {
    const navigation = useNavigation();
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        // Fetch initial data when the component mounts
        fetchData();
    }, []);

    const fetchData = async (endpoint = '/api/get_history/day') => {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            console.log('User data:', userData);
            const formdata = {
                id: userData.codeid
            };
            try {
                const response = await getUsedTalons({...formdata, endpoint});

                console.log(response);
                setTableData(response.data || []);
            } catch (err) {
                console.error('Request error:', err.message);
            }
        }
    };

    const filterData = (days) => {
        let endpoint;

        switch (days) {
            case 1:
                endpoint = '/api/get_history/day';
                break;
            case 2:
                endpoint = '/api/get_history/three_day';
                break;
            case 7:
                endpoint = '/api/get_history/week';
                break;
            case 31:
                endpoint = '/api/get_history/month';
                break;
            default:
                endpoint = '/api/get_history/day';
        }

        fetchData(endpoint);
    };

    const handleSwipeRight = ({ nativeEvent }) => {
            navigation.navigate('Сканер');
    };

    const renderButtons = () => {
        const buttons = [
            { label: 'За сегодня', days: 1 },
            { label: 'Вчера', days: 2 },
            { label: 'Неделя', days: 7 },
            { label: 'Месяц', days: 31 },
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

    
    const handleLogout = async () => {
        await AsyncStorage.clear();

        navigation.replace('login');
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
        {tableData.map((item, index) => (
          item.codeid !== null &&
          item.azs !== null &&
          item.barcode !== null &&
          item.date_use !== null && (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableItem}>
                <Text style={styles.label}>№ талона</Text>
                <Text style={styles.value}>{item.codeid}</Text>
              </View>
              <View style={styles.tableItem}>
                <Text style={styles.label}>Название АЗС</Text>
                <Text style={styles.value}>{item.nameid_azs}</Text>
              </View>
              <View style={styles.tableItem}>
                <Text style={styles.label}>Штрих код</Text>
                <Text style={styles.value}>{item.barcode}</Text>
              </View>
              <View style={styles.tableItem}>
                <Text style={styles.label}>Дата и время</Text>
                <Text style={styles.value}>{item.date_use}</Text>
              </View>
            </View>
          )
        ))}
      </ScrollView>
            {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity> */}

        </View>
    );
};

const styles = StyleSheet.create({
    logoutButton: {
        backgroundColor: 'red', // Change color as needed
        padding: 10,
        borderRadius: 5,
        marginTop: 12,
    },
    tableContainer: {
        marginTop: 10,
        borderRadius: 5,
        elevation: 5,
      },
      tableRow: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 8,
      },
      tableItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 3,
      },
      label: {
        fontWeight: 'bold',
        marginRight: 4,
        fontSize: 15
      },
      value: {
        flex: 1,
        textAlign: 'right',
        fontSize: 15
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
