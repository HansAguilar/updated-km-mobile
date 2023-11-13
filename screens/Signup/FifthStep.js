import React, { useState } from 'react';
import { styles } from '../../style/styles';
import { View, Text, Image, SafeAreaView, ImageBackground, ScrollView } from 'react-native'
import Header from '../../components/Header';
import InputText from '../../components/InputText';
import Button from '../../components/Button';
import ToastFunction from '../../config/toastConfig';
import Toast from 'react-native-toast-message';

function FifthStep({ navigation, details, setDetails, onChangeText }) {
  const [isSecure, setSecure] = useState({
    isPassword: true,
    isConfirmPassword: true
  });
  const [passwordDetails, setPasswordDetails] = useState({
    password: "",
    confirmPassword: ""
  })
  const onChangePaswordDetails = (name, value) => {
    setPasswordDetails({ ...passwordDetails, [name]: value })
  }
  const passwordOnChangeHandler = (type) => {
    if (type === "password") return setSecure({ ...isSecure, isPassword: !isSecure.isPassword });
    return setSecure({ ...isSecure, isConfirmPassword: !isSecure.isConfirmPassword });
  }
  const submitDetails = () => {
    if (!details.username || !passwordDetails.password || !passwordDetails.confirmPassword) return ToastFunction("error", "Fill up empty field");
    if (passwordDetails.password !== passwordDetails.confirmPassword) return ToastFunction("error", "Mismatch password and confirm password");
    setDetails({ ...details, password: passwordDetails.password });
    return navigation.navigate("Step 6")
  }
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/images/blob.png')} style={styles.image}>

        <ScrollView>
          <Toast />

          <View style={{ ...styles.containerWhite, zIndex: -1 }}>
            <View style={{ marginBottom: 12, marginRight: 'auto' }}>
              <Header />
              <Text style={{ color: "#2b2b2b", fontSize: 16, }} >Required information to account creation</Text>
            </View>

            <Image source={require('../../assets/images/rg1.png')} style={{ width: 250, height: 260, }} />

            <View style={{ flexDirection: 'column', gap: 10, width: '100%' }}>
              <View style={{ borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8, height: 50, width: '100%' }}>
                <InputText onChangeText={onChangeText} value={details.username} name={"username"} placeholder={"Username"} />
              </View>

              <View style={{ borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8, height: 50, width: '100%' }}>
                <InputText onChangeText={onChangePaswordDetails} value={passwordDetails.password} name={"password"} placeholder={"Password"} isSecure={isSecure.isPassword} iconName={isSecure.isPassword ? "eye-with-line" : "eye"} iconFunction={() => passwordOnChangeHandler("password")} iconColor={"#4b5563"} />
              </View>

              <View style={{ borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8, height: 50, width: '100%' }}>
                <InputText onChangeText={onChangePaswordDetails} value={passwordDetails.confirmPassword} name={"confirmPassword"} placeholder={"Confirm Password"} isSecure={isSecure.isConfirmPassword} iconName={isSecure.isConfirmPassword ? "eye-with-line" : "eye"} iconFunction={() => passwordOnChangeHandler("confirmPassword")} iconColor={"#4b5563"} />
              </View>
            </View>

            <Button onPress={submitDetails} title={"Next"} bgColor={"#06b6d4"} textColor={"#fff"} />
          </View>

        </ScrollView>

      </ImageBackground>
    </SafeAreaView>
  )
}

export default FifthStep