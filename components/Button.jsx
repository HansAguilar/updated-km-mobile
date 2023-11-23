import React, { Component } from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';

export default function Button({ title, onPress, bgColor, textColor, haveBorder, }) {
  const styles = StyleSheet.create({
    button: {
      width: '100%',
      padding: 10,
      backgroundColor: bgColor,
      borderRadius: 8,
      borderColor: haveBorder ? '#06b6d4' : '',
      borderWidth: haveBorder ? 2 : 0,
      zIndex: -10
    },
    text: {
      color: textColor,
      fontSize: 18,
      textAlign: "center",
      fontWeight: 500
    }
  })
  return (
    <TouchableHighlight style={styles.button} onPress={onPress} >
      <Text style={styles.text}>{title}</Text>
    </TouchableHighlight>
  )
}
