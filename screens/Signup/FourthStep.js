import React, { useState } from 'react'
import { styles } from '../../style/styles';
import { View, Text, Image, SafeAreaView, ImageBackground } from 'react-native';
import Header from '../../components/Header';
import InputText from '../../components/InputText';
import Button from '../../components/Button';
import Toast from 'react-native-toast-message';
import ToastFunction from '../../config/toastConfig';
import axios from 'axios';
import { PATIENT_URL } from '../../config/APIRoutes';

function FourthStep({ navigation, details, onChangeText }) {
  const checkPhoneNumberExist = async () => {
    try {
      const response = await axios.post(`${PATIENT_URL}/checkContactNumber/${details.contactNumber}`)

      if (response.data) {
        navigation.navigate("Step 5");
      }
    } catch (error) {
      ToastFunction("error", error.response.data.message);
    }
  }

  const submitButton = () => {
    if (!details.contactNumber) return ToastFunction("error", "Fill up empty field")
    if (!details.contactNumber.match(/^09\d{9}$/)) return ToastFunction("error", "Number must start at 09 and must contain 11 digit");
    checkPhoneNumberExist();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/images/blob.png')} style={styles.image}>
        <Toast />

        <View style={{ ...styles.containerWhite, alignItems: 'center' }}>
          <View style={{ marginBottom: 12, marginRight: 'auto' }}>
            <Header />
            <Text style={{ color: "#2b2b2b", fontSize: 16, }} >Required information to account creation</Text>
          </View>

          <Image source={require('../../assets/images/rg1.png')} style={{ width: 250, height: 260, margin: 'auto' }} />


          <View style={{ marginTop: 'auto', width: '100%', gap: 10 , marginBottom: 100}}>
            <View style={{ borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8, height: 50, width: '100%' }}>
              <InputText onChangeText={onChangeText} value={details.contactNumber} name={"contactNumber"} placeholder={"Phone Number"} keyboardType={"phone-pad"} />
            </View>

            <Button onPress={submitButton} title={"Next"} bgColor={"#06b6d4"} textColor={"#fff"} />
          </View>

        </View>
        <Toast />
      </ImageBackground>
    </SafeAreaView>
  )
}

export default FourthStep