import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { styles } from '../style/styles';
import EntypoIcon from 'react-native-vector-icons/Entypo';


export default function InputText({ onChangeText, name, value, placeholder, isSecure, iconName, iconFunction, iconColor, isEditable, keyboardType, multiline }) {
  return <View style={styles.inputWrapper}>
    <TextInput
      value={value}
      onChangeText={(text) => onChangeText(name, text)}
      placeholder={placeholder}
      keyboardAppearance='dark'
      style={styles.inputText}
      underlineColorAndroid="#fff"
      secureTextEntry={isSecure}
      editable={isEditable}
      multiline={multiline}
      keyboardType={keyboardType}
    />
    {
      iconName && (
        <Text style={{ width: 'auto', height: 'auto' }} onPress={iconFunction}>
          <EntypoIcon name={`${iconName}`} size={20} color={`${iconColor}`} />
        </Text>
      )
    }
  </View>
}
