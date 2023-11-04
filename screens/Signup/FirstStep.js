import React from 'react'
import { styles } from '../../style/styles';
import { View, Text, Image, SafeAreaView, ImageBackground, Dimensions, ScrollView, } from 'react-native'
import Header from '../../components/Header';
import InputText from '../../components/InputText';
import Button from '../../components/Button';
import ToastFunction from '../../config/toastConfig';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const { width } = Dimensions

function FirstStep({ navigation, details, onChangeText }) {
  const submitButton = () => {
    if (!details.firstname || !details.lastname) return ToastFunction("error", "Fill up empty field");
    navigation.navigate("Step 2");
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
                <InputText onChangeText={onChangeText} value={details.firstname} name={"firstname"} placeholder={"Firstname"} />
              </View>

              <View style={{ borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8, height: 50, width: '100%' }}>
                <InputText onChangeText={onChangeText} value={details.middlename} name={"middlename"} placeholder={"Middlename"} />
              </View>

              <View style={{ borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8, height: 50, width: '100%' }}>
                <InputText onChangeText={onChangeText} value={details.lastname} name={"lastname"} placeholder={"Lastname"} />
              </View>
            </View>

            <Button onPress={submitButton} title={"Next"} bgColor={"#06b6d4"} textColor={"#fff"} />
          </View>
        </ScrollView>

      </ImageBackground>
    </SafeAreaView >
  )
}

export default FirstStep