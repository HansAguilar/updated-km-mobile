import React, { useState, useRef } from 'react';
import { View, Text, Image, Pressable, SafeAreaView, ScrollView, ImageBackground } from 'react-native';
import Header from '../../components/Header';
import InputText from '../../components/InputText';
import Button from '../../components/Button';
import { styles } from '../../style/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/moment';
import axios from 'axios';
import { PATIENT_URL } from '../../config/APIRoutes';
import ToastFunction from '../../config/toastConfig';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

function SecondStep({ navigation, details, setDetails, onChangeText }) {
  const [showPicker, setShowPicker] = useState(false);
  const birthday = useRef("");

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onChangeDate = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDetails({
        ...details,
        ["birthday"]: currentDate
      })
      birthday.current = `${moment(currentDate).format("LL")}`;

      if (Platform.OS === "android") {
        toggleDatepicker();
        setDetails({
          ...details,
          ["birthday"]: currentDate
        })
        birthday.current = `${moment(currentDate).format("LL")}`;
      }
    }
    else {
      toggleDatepicker();
    }
  }

  const onSubmitButton = async () => {
    console.log(details.email);
    if (!details.address || !details.birthday || !details.email) return ToastFunction("error", "Fill empty field!");
    try {
      const response = await axios.post(`${PATIENT_URL}/checkEmail/${details.email}`);

      if (response.data) {
        navigation.navigate("Step 3")
      }
    } catch (error) {
      ToastFunction("error", error.response.data.message);
    }
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
                <InputText onChangeText={onChangeText} value={details.address} name="address" placeholder="Address" />
              </View>

              <View style={{ borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8, height: 50, width: '100%' }}>
                {
                  showPicker && (
                    <DateTimePicker
                      mode="date"
                      display='spinner'
                      value={details.birthday}
                      onChange={onChangeDate}
                    />
                  )
                }
                {
                  !showPicker && (
                    <Pressable
                      style={{ width: '100%' }}
                      onPress={toggleDatepicker}
                    >
                      <InputText onChangeText={onChangeText} value={birthday.current} placeholder={"Birthday"} isEditable={false} />
                    </Pressable>
                  )
                }
              </View>

              <View style={{ borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8, height: 50, width: '100%' }}>
                <InputText onChangeText={onChangeText} value={details.email} name="email" placeholder="Email" />
              </View>
            </View>

            <Button onPress={onSubmitButton} title={"Next"} bgColor={"#06b6d4"} textColor={"#fff"} />
          </View>
        </ScrollView>

      </ImageBackground>
    </SafeAreaView >
  );
}

export default SecondStep;
