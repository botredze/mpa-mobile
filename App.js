import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScannerScreen from './screens/ScannerScreen';
import ViewScreen from "./screens/ViewScreen";
import LoginScreen from './screens/LoginScreen';
import HistoryScreen from './screens/HistoryScreen';
import HomeScreen from "./screens/HomeScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Жыйынтыктар(Отчет)" component={HomeScreen} />
            <Tab.Screen name="Сканер" component={ScannerScreen} />
        </Tab.Navigator>
    );
};

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="HomeTabs" // Set initialRouteName to "HomeTabs"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="HomeTabs" component={HomeTabs} />
                <Stack.Screen name="login" component={LoginScreen} />
                {/*<Stack.Screen name="Home" component={HomeScreen} />*/}
                {/*<Stack.Screen name="scanner" component={ScannerScreen} />*/}
                {/*<Stack.Screen name="ViewScreen" component={ViewScreen} />*/}
                {/*<Stack.Screen name="HistoryScreen" component={HistoryScreen} />*/}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
