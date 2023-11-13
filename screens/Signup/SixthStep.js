import React, { useState } from 'react';
import { styles } from '../../style/styles';
import { View, Text, Image, SafeAreaView, ImageBackground } from 'react-native'
import Header from '../../components/Header';
import Button from '../../components/Button';
import ToastFunction from '../../config/toastConfig';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

function SixthStep({ navigation, details, setDetails, onChangeText }) {
  const [profile, setProfile] = useState("");
  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      return ToastFunction("error", "Kindly select an image");
    }

    const selectedAsset = result.assets[0];
    const base64Image = await convertAssetToBase64(selectedAsset);
    setProfile(base64Image);
  };

  const convertAssetToBase64 = async (asset) => {
    const response = await fetch(asset.uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const btnSubmitHandler = () => {
    if (!profile) return ToastFunction("error", "Select image profile")
    setDetails({ ...details, profile: profile });
    navigation.navigate("Step 7");
  }
  return (
    <SafeAreaView style={styles.container}>
      <Toast />

      <ImageBackground source={require('../../assets/images/blob.png')} style={styles.image}>

        <View style={{ flex: 1, padding: 20, alignItems: 'center' }}>
          <View style={{ marginBottom: 12, marginRight: 'auto' }}>
            <Header />
            <Text style={{ color: "#2b2b2b", fontSize: 16, }} >Required information to account creation</Text>
          </View>

          <View style={{ flex: 1, alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <View style={{ width: 300, height: 300, backgroundColor: "#cccc", borderRadius: 500 }}>
              {
                profile &&
                (<Image source={{ uri: profile }} style={{ width: '100%', height: '100%', borderRadius: 500, borderColor: '#06b6d4', borderWidth: 2 }} />)
              }
            </View>
            <Text onPress={handleImageUpload} style={{ color: "#cccccc" }}>Set Profile</Text>
          </View>

          <Button onPress={btnSubmitHandler} title={"Next"} bgColor={"#06b6d4"} textColor={"#fff"} />
        </View>

      </ImageBackground>
    </SafeAreaView>
  )
}

export default SixthStep