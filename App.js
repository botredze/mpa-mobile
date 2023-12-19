import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ScannerScreen from './screens/ScannerScreen';
import ViewScreen from "./screens/ViewScreen";
import LoginScreen from './screens/LoginScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createStackNavigator();

export default function App ()
{
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={ { headerShown: false } }
      >
        <Stack.Screen name="login" component={ LoginScreen } />
        <Stack.Screen name="scanner" component={ ScannerScreen } />
        <Stack.Screen name="ViewScreen" component={ ViewScreen } />
        <Stack.Screen name="HistoryScreen" component={ HistoryScreen } />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
