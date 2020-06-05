import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

const Input = ({inputValue, onChangeText}) => (
    <TextInput
      style={styles.input}
      value={inputValue}
      onChangeText={onChangeText}
      placeholder="Enter a weight"
      keyboardType="number-pad"
      multiline={false}
      underlineColorAndroid="transparent"
      maxLength={30}
      autoCorrect={false}
    />
);

const styles = StyleSheet.create({
  input: {
    paddingTop: 10,
    paddingRight: 15,
    fontSize: 34,
    color: 'black',
    fontWeight: '500'
  }
});

export default Input;
