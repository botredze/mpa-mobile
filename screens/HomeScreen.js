import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {

  const navigation = useNavigation();

  const handleScanButtonPress = () => {
    navigation.navigate('Scanner');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/gazprom-logo.jpg')} style={styles.logo} />
        <Text style={styles.companyName}>Газпром</Text>
      </View>

      <TouchableOpacity style={styles.scanButton} onPress={handleScanButtonPress}>
        <Text style={styles.scanButtonText}>Сканировать топливную карту</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scanButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    alignItems: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
