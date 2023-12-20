import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomHeader = ({ handleLogout }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleLogout}>
      <Ionicons name="exit" size={24} color="white" />
      <Text style={styles.text}>Выход</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 150,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12, // Increased padding for better visibility
    backgroundColor: '#62B1F6', // Adjust the background color as needed
    borderRadius: 5,
  },
  text: {
    color: 'white',
    marginLeft: 8,
  },
});

export default CustomHeader;
