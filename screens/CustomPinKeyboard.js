import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ViewPropTypes } from 'deprecated-react-native-prop-types'

const CustomPinKeyboard = ({ onPress, onBackspace }) => {
  const renderKey = (value) => (
    <TouchableOpacity style={styles.key} onPress={() => onPress(value)}>
      <Text style={styles.keyText}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['rgba(237, 237, 237, 0)', 'rgba(211, 211, 211, 0)']}
      style={styles.keyboardContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.row}>
        {renderKey('1')}
        {renderKey('2')}
        {renderKey('3')}
      </View>
      <View style={styles.row}>
        {renderKey('4')}
        {renderKey('5')}
        {renderKey('6')}
      </View>
      <View style={styles.row}>
        {renderKey('7')}
        {renderKey('8')}
        {renderKey('9')}
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.key} onPress={onBackspace}>
          <Text style={styles.keyText}>←</Text>
        </TouchableOpacity>
        {renderKey('0')}
        <TouchableOpacity style={styles.key} onPress={() => onPress('OK')}>
          <Text style={styles.keyText}>OK</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: 'transparent', // Set the background color to transparent
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10, // Increase the horizontal margin between keys
  },
  keyText: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent', // Set the background color to transparent
  }
});

export default CustomPinKeyboard;
