import React from 'react';
import { View, Text, Image, SafeAreaView, Pressable, Dimensions, ImageBackground } from 'react-native';
import Header from '../../components/Header';
import InputText from '../../components/InputText';
import Button from '../../components/Button';
import { styles } from '../../style/styles';

function ThirdStep({ navigation, details, onChangeText }) {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/images/blob.png')} style={styles.image}>

        <View style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: 20, rowGap: 50 }}>

          <View style={{ marginBottom: 12, marginRight: 'auto' }}>
            <Header value="Gender" />
            <Text style={{ color: "#2b2b2b", fontSize: 16, }} >Kindly select your gender</Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'column', rowGap: 20, }}>
            <Pressable style={{ display: 'flex', justifyContent: "center", alignItems: "center", borderColor: '#06b6d4', borderWidth: 2, borderRadius: 8 }} onPress={() => {
              onChangeText("gender", "male");
              navigation.navigate("Step 4")
            }}>
              <Image source={require('../../assets/images/male2.png')} style={{ width: 200, height: 200 }} />
              <Text style={{ color: "#2b2b2b", fontWeight: "600", paddingBottom: 4 }}>Male</Text>
            </Pressable>

            <Pressable style={{ display: 'flex', justifyContent: "center", alignItems: "center", borderColor: '#06b6d4', borderWidth: 2, borderRadius: 8 }} onPress={() => {
              onChangeText("gender", "female");
              navigation.navigate("Step 4")
            }}>
              <Image source={require('../../assets/images/female2.png')} style={{ width: 200, height: 200, }} />
              <Text style={{ color: "#2b2b2b", fontWeight: "600", paddingBottom: 4 }}>Female</Text>
            </Pressable>
          </View>

        </View>

      </ImageBackground>
    </SafeAreaView >
  )
}

export default ThirdStep