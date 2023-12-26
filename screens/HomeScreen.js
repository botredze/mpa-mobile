import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal} from 'react-native';
import {getUsedTalons} from "../api/Api";
import {PanGestureHandler, State} from "react-native-gesture-handler";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons} from "@expo/vector-icons";

const HomeScreen = () => {
    const navigation = useNavigation();
    const [tableData, setTableData] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [userdata, setUserdata] = useState('')
    const [azs, setAzs] = useState(0)
    const [activeButton, setActiveButton] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);

    const [logoutWithible, setLogoutWithible] = useState(false)

    useEffect(() => {
        fetchData();
    }, []);


    const handleFocus = useCallback(() => {
        fetchData();
    }, [fetchData]);

    useFocusEffect(handleFocus);


    const fetchData = async (endpoint = '/get_history/day') => {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setUserdata(userData.name)
            setAzs(userData.nameid_azs)
            //console.log('User data:', userData);
            const formdata = {
                id: userData.codeid
            };
            try {
                const response = await getUsedTalons({...formdata, endpoint});

              //  //console.log(response);
                setTableData(response.data || []);
                setReportData(response.total || [])
            } catch (err) {
                console.error('Request error:', err.message);
            }
        }
    };

    const filterData = (days) => {
        let endpoint;

        switch (days) {
            case 1:
                endpoint = '/get_history/day';
                break;
            case 2:
                endpoint = '/get_history/tommorow';
                break;
            case 3:
                endpoint = '/get_history/three_day';
                break;
            case 7:
                endpoint = '/get_history/week';
                break;
            case 31:
                endpoint = '/get_history/month';
                break;
            default:
                endpoint = '/get_history/day';
        }

        fetchData(endpoint);
    };

    const handleSwipeRight = ({nativeEvent}) => {
        navigation.navigate('Сканер');
    };

    const renderButtons = () => {
        const buttons = [
            {label: 'За сегодня', days: 1},
            {label: 'Вчера', days: 2},
            {label: '3 Дня', days: 3},
            {label: 'Неделя', days: 7},
            {label: 'Месяц', days: 31},
        ];

        return buttons.map((button) => (
            <TouchableOpacity
                key={button.label}
                style={[
                    styles.button,
                    activeButton === button.days ? styles.activeButton : null,
                ]}
                onPress={() => handleButtonPress(button.days)}
            >
                <Text style={styles.buttonText}>{button.label}</Text>
            </TouchableOpacity>
        ));
    };

    const handleButtonPress = (days) => {
        setActiveButton(days);
        filterData(days);
    };

    const confirmHandleLogout = async () => {
        setLogoutWithible(true)
        setModalVisible(true);
        //console.log('хуй')
    };

    const closeResultModal = async () => {
        setLogoutWithible(false)

        setModalVisible(false);
    }

    const calculateReport = () => {
        const renderTableHeader = () => {
            return (
                <View style={styles.tableRowReport}>
                    <View style={styles.leftColumn}>
                        <Text style={styles.valueNum}>№</Text>
                    </View>
                    <View style={styles.gsmColumn}>
                        <Text style={styles.valueGsm}>ГСМ</Text>
                    </View>
                    <View style={styles.rightNuminal}>
                        <Text style={styles.valueNuminal}>Номинал</Text>
                    </View>
                    <View style={styles.rightKol}>
                        <Text style={styles.value}>Кол-во</Text>
                    </View>
                </View>
            );
        };

        const renderTableRow = (item, index) => {
            return (
                <View key={index} style={styles.tableRowReport}>
                    <View style={styles.leftColumn}>
                        <Text style={styles.valueNum}>{index + 1}</Text>
                    </View>
                    <View style={styles.gsmColumn}>
                        <Text style={styles.value}>{item.nameid_gsm}</Text>
                    </View>
                    <View style={styles.rightNuminal}>
                        <Text style={styles.value}>{item.nominal}</Text>
                    </View>
                    <View style={styles.rightKol}>
                        <Text style={styles.value}>{item.total}</Text>
                    </View>
                </View>
            );
        };

      //  console.log(reportData);

        return (
            <View style={styles.reportContainer}>
                <Text style={styles.reportTitle}>Итого </Text>

                {/* Render the table header */}
                {renderTableHeader()}

                {/* Render the table rows */}
                {reportData.map((item, index) => renderTableRow(item, index))}
            </View>
        );
    };



    const renderHeader = () => {
            return (
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Активированные талоны</Text>

                    <View style={styles.userInfoContainer}>
                        <View style={styles.iconContainer}>
                            {/* Your icon component goes here */}
                            {/*<Ionicons name="ios-person" size={24} color="black"/>*/}
                            <Text style={styles.usernameText}>{userdata}</Text>
                            <Text style={styles.azsText}> {azs}</Text>
                        </View>


                        <TouchableOpacity style={styles.iconContainerLogout} onPress={confirmHandleLogout}>
                            {/* Your logout icon component goes here */}
                            <Ionicons name="power" size={35} color="red"/>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        };

        const handleLogout = async () => {
            await AsyncStorage.clear();
            navigation.replace('login');
            closeResultModal()

        };

        return (
            <View style={styles.mainContainer}>
                {renderHeader()}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeResultModal}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity
                                style={styles.activateButton}
                                onPress={handleLogout}

                            >
                                <Text style={styles.activateButtonText}>Выйти</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeResultModal}
                            >
                                <Text style={styles.closeButtonText}>Отмена</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View style={styles.buttonsContainer}>
                    <ScrollView
                        horizontal
                        contentContainerStyle={styles.buttonsContentContainer}
                    >
                        {renderButtons()}
                    </ScrollView>
                </View>
                <ScrollView style={styles.tableContainer}>
                    {tableData.map((item, index) => (
                        item.codeid !== null &&
                        item.azs !== null &&
                        item.barcode !== null &&
                        item.date_use !== null && (
                            <View key={index} style={styles.numContainer}>
                                <View>
                                    <Text style={styles.numbers}>{index + 1}</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <View style={styles.leftColumn}>
                                        <Text style={styles.valueNum}>{item.code}</Text>
                                        <Text style={styles.barcodeValue}>{item.barcode}</Text>
                                        <Text style={styles.value}>{item.nameid_gsm}  {item.nominal} л</Text>
                                    </View>
                                    <View style={styles.rightColumn}>
                                        <Text style={styles.value}>{item.date_use.split(' ')[0]}</Text>
                                        <Text style={styles.dateTime}>{item.date_use.split(' ')[1]}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    ))}
                    <View>
                        {calculateReport()}
                    </View>
                </ScrollView>

            </View>
        );
    };

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalView: {
            margin: 20,
            backgroundColor: 'rgba(255,255,255,0.96)',
            borderRadius: 20,
            padding: 35,
            alignItems: 'center', // Center content horizontally
            justifyContent: 'center', // Center content vertically
            // You can adjust the width and height as needed
            flexDirection: 'row',
            width: '90%',
            height: 'auto',
            //marginTop: 20
            // Rest of your styling...
        },
        activateButton: {
            backgroundColor: '#cc0404',
            borderRadius: 5,
            padding: 10,
            margin: 5,
            //width: '40%', // Adjust the width as needed
            alignItems: 'center', // Center content horizontally
        },
        closeButton: {
            backgroundColor: '#0023f8',
            borderRadius: 5,
            padding: 10,
            margin: 5,
            width: '40%', // Adjust the width as needed
            alignItems: 'center', // Center content horizontally
        },
        activateButtonText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 23
        },
        closeButtonText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 23
        },
        resultContainer: {
            backgroundColor: '#ffffff',
            padding: 20,
            borderRadius: 10,
            marginTop: 10,
            alignItems: 'center',
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between',
        },

        activeButton: {
            backgroundColor: 'lightgray', // Любой цвет, который вы хотите использовать для подсветки активной кнопки
        },

        leftColumn: {
            gap: 7,
            flex: 1,
            flexDirection: 'column',
            marginLeft: 12,
            marginRight: 5, // Расстояние между левой и правой колонками
            alignItems: 'flex-start', // Выравнивание элементов в левую сторону
           // backgroundColor: 'black`'
        },

        rightColumn: {
          // gap: 4,
            //flex: 1,
            //paddingLeft: 35,
            flexDirection: 'column',
            //marginLeft: 10, // Расстояние между правой и левой колонками
            alignItems: 'flex-start', // Выравнивание элементов в левую сторону
          //  backgroundColor: 'blue',
            width: '24%'
        },

        rightNuminal: {
             gap: 4,
            //flex: 1,
            //paddingLeft: 35,
            flexDirection: 'column',
            //marginLeft: 10, // Расстояние между правой и левой колонками
            alignItems: 'center', // Выравнивание элементов в левую сторону
            //backgroundColor: 'blue',
            width: '23%'
        },

        rightKol: {
            gap: 4,
            //flex: 1,
            //paddingLeft: 35,
            flexDirection: 'column',
            //marginLeft: 10, // Расстояние между правой и левой колонками
            alignItems: 'center', // Выравнивание элементов в левую сторону
          //  backgroundColor: 'blue',
            width: '23%'
        },

        gsmColumn: {
             gap: 4,
            //flex: 1,
            //paddingLeft: 5,
            flexDirection: 'column',
            //marginLeft: 10, // Расстояние между правой и левой колонками
            alignItems: 'flex-start', // Выравнивание элементов в левую сторону
            textAlign: 'left',
            //backgroundColor: 'blue',
            width: '40%'
        },
        dateTimeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },

        headerContainer: {
            // flexDirection: 'column', // Change to column
            alignItems: 'center',
            marginBottom: 20,
        },

        reportContainer: {
            marginTop: 20,
            padding: 16,
            borderRadius: 5,
            backgroundColor: '#f0f0f0',
            width: '100%'
        },

        reportContainerRow : {
            marginTop: 20,
          flex: 1,
          flexDirection: "row"
        },

        reportTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            marginLeft: 14
        },

        reportText: {
            fontSize: 17,
            marginBottom: 10,
            fontWeight: 'bold'
        },

        headerText: {
            fontSize: 21,
            fontWeight: 'bold',
            marginBottom: 10, // Add margin to create space between text and icons
        },

        userInfoContainer: {
            display: "flex",
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between', // Add this to evenly distribute space
            // paddingHorizontal: 20, // Add padding for additional space
        },

        usernameText: {
            marginLeft: 10,
            marginRight: 10, // Add right margin for space between username and logout icon
            fontWeight: 'bold',
            fontSize: 23,
        },

        azsText: {
            marginLeft: 50, // Add right margin for space between username and logout icon
            fontWeight: 'bold',
            fontSize: 23,
        },

        numContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            //width: '94%'
        },


        valueLeft: {
            flex: 1,
            textAlign: 'left',
            marginRight: 10, // Расстояние между левыми элементами и правыми
            fontSize: 15,
        },
        valueRight: {
            flex: 1,
            textAlign: 'right',
            marginLeft: 10, // Расстояние между правыми элементами и левыми
            fontSize: 15,
        },
        iconContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            // padding: 10,
        },

        iconContainerLogout: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            padding: 10,
        },

        logoutButton: {
            backgroundColor: 'red', // Change color as needed
            padding: 10,
            borderRadius: 5,
            marginTop: 12,
        },
        tableContainer: {
            marginTop: 10,
            borderRadius: 5,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,

        },
        tableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            marginBottom: 8,
            width: '97%',
           // backgroundColor: 'red'
        },

        tableRowReport: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            marginBottom: 8,
            width: '100%',
            //backgroundColor: 'red'
        },
        rowContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
        tableItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingVertical: 3,
        },

        tableItemTime: {
            flexDirection: 'row',
            // justifyContent: 'space-between',
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
            fontSize: 15,
            fontWeight: 'bold'
        },

        barcodeValue: {
            flex: 1,
            textAlign: 'right',
            fontSize: 16,
            fontWeight: 'bold',
            color: '#022f94'
        } ,

        valueNuminal: {
            flex: 1,
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 'bold'
        },

        valueGsm: {
            flex: 1,
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 'bold'
        },

        valueNum: {
            flex: 1,
            textAlign: 'right',
            fontSize: 17,
            fontWeight: 'bold',
        },

        dateTime: {
            flex: 1,
            textAlign: 'right',
            fontSize: 17,
            color: 'red'
        },

        timevalue: {
            flex: 1,
            textAlign: 'right',
            fontSize: 15,
            color: '#ff1313'
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
            marginTop: 30,
        },

        numbers: {
            fontWeight: 'bold',
            fontSize: 17,
        },

        container: {
            flex: 1,
            marginTop: 10,
        },
        buttonsContainer: {
            marginBottom: 16,
            //  boxShadow: 'none',
        },
        buttonsContentContainer: {
            flexDirection: 'row',
        },
        button: {
            backgroundColor: '#0023f8',
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

        reportRight: {
            gap: 7,
            flex: 1,
            flexDirection: 'column',
            marginLeft: 25,
            marginRight: 10,
            alignItems: 'flex-start',
        },

        reportLeft: {
            gap: 7,
            flex: 1,
            flexDirection: 'column',
            marginLeft: 25,
            marginRight: 10,
            alignItems: 'flex-start',
        },

    });

    export default HomeScreen;

