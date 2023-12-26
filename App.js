import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScannerScreen from './screens/ScannerScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from "./screens/HomeScreen";
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons from the appropriate library
import {useNavigation} from "@react-navigation/native";
import {Platform, TouchableOpacity} from 'react-native';
import NumberInputScreen from "./screens/CustomHeader";
import SplashScreen from "react-native-splash-screen";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const HomeTabs = () => {
    const navigation = useNavigation();
    return (
      <Tab.Navigator
        screenOptions={ ({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
  
            if (route.name === 'Жыйынтыктар(Отчет)') {
              iconName = 'ios-list';
            } else if (route.name === 'Сканер') {
              iconName = 'ios-barcode';
            } else if (route.name === 'Ручной ввод') {
              iconName = 'ios-search'; // Change this to the desired logout icon
            }
  
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Жыйынтыктар(Отчет)" component={HomeScreen}/>
        <Tab.Screen name="Сканер" component={ScannerScreen} />
          <Tab.Screen name="Ручной ввод" component={NumberInputScreen}
          />
      </Tab.Navigator>
    );
  };

export default function App() {
    // useEffect(() => {
    //     if (Platform.OS === 'android')
    //     SplashScreen.hide()
    // }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="login"
                screenOptions={{ headerShown: false, headerShadowVisible: false }}

            >
                <Stack.Screen name="HomeTabs" component={HomeTabs} />
                <Stack.Screen name="login" component={LoginScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
