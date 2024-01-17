import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal} from 'react-native';
import {getUsedTalons, getUsedTalonsFilter} from "../api/Api";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons} from "@expo/vector-icons";
import {DateTimePickerModal} from "react-native-modal-datetime-picker";
import moment from "moment";
import { startOfDay, endOfDay } from 'date-fns';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [tableData, setTableData] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [userdata, setUserdata] = useState('')
    const [azs, setAzs] = useState(0)
    const [activeButton, setActiveButton] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);


    const defaultStartDate = startOfDay(new Date()); 
    const defaultEndDate = endOfDay(new Date());    

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [logoutWithible, setLogoutWithible] = useState(false)


    const handleFocus = useCallback(() => {
        fetchData(startDate, endDate);
    }, [fetchData]);

    useFocusEffect(handleFocus);

    useEffect(() => {
        fetchData(startDate, endDate);
      }, [startDate, endDate]);

      useEffect(() =>{
        setStartDate(new Date())
        setEndDate(new Date())
      },[])
    
    const confirmHandleLogout = async () => {
        setLogoutWithible(true)
        setModalVisible(true);    };

    const closeResultModal = async () => {
        setLogoutWithible(false)
        setModalVisible(false);
    }
         
    const formatDate = (date) => {
        return moment(date).format("DD.MM.YYYY");
      };
      
    const fetchData = async (start, end) => {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserdata(userData.name);
          setAzs(userData.nameid_azs);
      
          const formdata = {
            id: userData.codeid,
          };
    

          console.log(start, end);
          try {
            let response;
      
            if (start && end) {
              response = await getUsedTalons({
                ...formdata,
                start: start,
                end: end,
              });
            } else {
                console.error('Request error:', err.message);
             }

            if(response.status === 'success'){
            setTableData(response.data || []);
            setReportData(response.total || []);
            }else {
                setTableData([]);
                setReportData([]);

                return (<Text>{response.message}</Text>)
            }
          } catch (err) {
            console.error('Request error:', err.message);
          }
        }
      };

      const handleStartDateConfirm = (date) => {
        setStartDate(date);
        setStartDatePickerVisible(false);
        fetchData(date, endDate);
      };
      
      const handleEndDateConfirm = (date) => {
        setEndDate(date);
        setEndDatePickerVisible(false);
        fetchData(startDate, date);
      };
      

    
    const renderDateInputs = () => {
        return (
          <View style={styles.dateInputsContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>От:</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setStartDatePickerVisible(true)}
              >
                <Text style={styles.dateText}>{formatDate(startDate)}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>До:</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setEndDatePickerVisible(true)}
              >
                <Text style={styles.dateText}>{formatDate(endDate)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      };

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

                   {renderDateInputs()}
<DateTimePickerModal
  isVisible={isStartDatePickerVisible}
  mode="date"
  onConfirm={handleStartDateConfirm}
  onCancel={() => setStartDatePickerVisible(false)}
/>
<DateTimePickerModal
  isVisible={isEndDatePickerVisible}
  mode="date"
  onConfirm={handleEndDateConfirm}
  onCancel={() => setEndDatePickerVisible(false)}
/>
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
                                        <Text style={styles.dateDate}>{item.date_use.split(' ')[0]}</Text>
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
        dateInputsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
           // marginVertical: 10,
        },
        inputContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
           // backgroundColor: 'blue'
        },
        labelText: {
            marginRight: 10,
            fontSize: 16,
            fontWeight: 'bold',
        },
        dateInput: {
            padding: 10,
            borderWidth: 1,
            borderColor: '#1b55a4',
            borderRadius: 5,
            width: '70%',
            backgroundColor: '#1b55a4',
           // color: 'red'
           alignItems: 'center',
        },
        dateText: {
            fontSize: 16,
            color: 'white', 
          },
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
            fontSize: 16,
            fontWeight: 'bold'
        },
        

        barcodeValue: {
            flex: 1,
            textAlign: 'right',
            fontSize: 13,
            fontWeight: 'bold',
            color: '#022f94'
        } ,

        valueNuminal: {
            flex: 1,
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 'bold'
        },

        valueGsm: {
            flex: 1,
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 'bold'
        },

        valueNum: {
            flex: 1,
            textAlign: 'right',
            fontSize: 13,
            fontWeight: 'bold',
        },

        dateTime: {
            flex: 1,
            textAlign: 'right',
            fontSize: 16,
            color: 'red', 
            fontWeight: 'bold',
        },      
          dateDate: {
            flex: 1,
            textAlign: 'right',
            fontSize: 16,
            fontWeight: 'bold'
        },

        timevalue: {
            flex: 1,
            textAlign: 'right',
            fontSize: 17,
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

