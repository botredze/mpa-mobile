import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScannerScreen from './screens/ScannerScreen';
import ViewScreen from "./screens/ViewScreen";
import LoginScreen from './screens/LoginScreen';
import HistoryScreen from './screens/HistoryScreen';
import HomeScreen from "./screens/HomeScreen";
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons from the appropriate library
import CustomHeader from './screens/CustomHeader';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onPress } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes';
import {useNavigation} from "@react-navigation/native";
import { TouchableOpacity } from 'react-native';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const HomeTabs = () => {
    const navigation = useNavigation();
  
    const handleLogout = async () => {
      await AsyncStorage.clear();
      navigation.replace('login');
    };
  
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
  
            if (route.name === 'Жыйынтыктар(Отчет)') {
              iconName = 'ios-list';
            } else if (route.name === 'Сканер') {
              iconName = 'ios-barcode';
            } else if (route.name === 'Выйти') {
              iconName = 'ios-exit'; // Change this to the desired logout icon
            }
  
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Жыйынтыктар(Отчет)" component={HomeScreen} />
        <Tab.Screen
          name="Выйти"
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  handleLogout();
                  props.accessibilityState.selected = false; 
                }}
              />
            ),
          }}
          component={CustomHeader}
        />
        <Tab.Screen name="Сканер" component={ScannerScreen} />
      </Tab.Navigator>
    );
  };

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="login"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="HomeTabs" component={HomeTabs} />
                <Stack.Screen name="login" component={LoginScreen} />
                <Stack.Screen name="ViewScreen" component={ViewScreen} />
                <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
