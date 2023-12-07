import React, { useEffect } from 'react';
import { View, SafeAreaView, Text, Image, ImageBackground } from 'react-native';
import Button from '../components/Button';
import { styles } from '../style/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PATIENT_URL } from '../config/APIRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { checkIfValidPatient } from '../redux/action/PatientVerification';

const Home = React.memo(({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, valid, invalid } = useSelector((state) => state.patientVerification);

  const checkIfValidToken = async () => {
    const token = await AsyncStorage.getItem('token');
    dispatch(checkIfValidPatient(token));
  };

  useEffect(() => {
    checkIfValidToken();
  }, []);

  useEffect(() => {
    if (valid === "Valid") { navigation.navigate('Patient'); }
    if (valid === "Dentist") { navigation.navigate("Dentist") }
    if (invalid) { }
  }, [loading, valid, invalid]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', position: 'relative' }}>
      <ImageBackground source={require('../assets/images/blob.png')} style={styles.image}>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
            <Image source={require('../assets/images/logo2.jpg')} style={{ width: 250, height: 250, borderRadius: 300 }} />
          </View>

          <View style={{ gap: 10 }}>
            
            <View style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 20, marginBottom: 20 }}>
              <Text style={{ ...styles.header2, textAlign: 'center', color: '#2b2b2b' }}>Let's get started</Text>
              <Text style={{ ...styles.paragraph, textAlign: 'center', color: '#2b2b2b' }}>Login to enjoy the features we've provided, and stay healthy.</Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 20 }}>
              <Button title='Login' onPress={() => navigation.navigate('Login')} bgColor='#06b6d4' textColor='#fff' haveBorder={false} />
              <Button title='Signup' onPress={() => navigation.navigate('Signup')} textColor='#06b6d4' haveBorder={true} />
            </View>

          </View>
        </View>

      </ImageBackground>
    </SafeAreaView>
  )
})

export default React.memo(Home);
