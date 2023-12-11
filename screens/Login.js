import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, ImageBackground } from 'react-native';
import { styles } from '../style/styles';
import Button from '../components/Button';
import InputText from '../components/InputText';
import ToastFunction from '../config/toastConfig';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin, logOutAccount } from '../redux/action/LoginAction';

const Login = React.memo(({ navigation }) => {
  const { loading, account, error } = useSelector((state) => state.login)
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    username: '',
    password: ''
  });
  const [isSecure, setSecure] = useState(true);

  const onChangeText = (name, value) => {
    setUserData({ ...userData, [name]: value });
  };

  const checkIfValidAccount = async () => {
    await AsyncStorage.setItem('token', account.token);
    setUserData({ username: '', password: '' })
    navigation.navigate(`${account.accountType}`);
  }

  useEffect(() => {
    if (account) {
      checkIfValidAccount();
    }
  }, [account]);

  useEffect(() => {
    if (error) {
      ToastFunction("error", error);
    }
  }, [error]);


  const loginButtonHandler = async () => {
    if (!userData.username || !userData.password) {
      return ToastFunction('error', 'Fill up empty field');
    }
    dispatch(loginAdmin(userData));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../assets/images/blob.png')} style={styles.image}>
        <Toast />

        <View style={styles.containerWhite}>
          <Text style={{ textAlign: 'left', fontSize: 30, fontWeight: '500', marginRight: 'auto', color: '#2b2b2b' }}>Sign In</Text>

          <View style={styles.subContainer}>

            <View style={{ ...styles.inputContainer, marginBottom: 60 }}>
              <View style={{ borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8 }}>
                <InputText
                  onChangeText={onChangeText}
                  name="username"
                  value={userData.username}
                  placeholder="Username"
                />
              </View>

              <View style={{ borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8 }}>
                <InputText
                  onChangeText={onChangeText}
                  name="password"
                  value={userData.password}
                  placeholder="Password"
                  isSecure={isSecure}
                  iconName={isSecure ? 'eye-with-line' : 'eye'}
                  iconFunction={() => setSecure((prev) => !prev)}
                  iconColor="#CCCCCC"
                />
              </View>

              <Text style={{ textAlign: 'right', fontSize: 14, color: '#CCCCCC', marginTop: 5 }} onPress={() => navigation.navigate('ForgotPassword')}>
                Forgot password?
              </Text>

            </View>
            {
              loading ? <Text style={{width:"100%", paddingVertical:10, backgroundColor:"#06b6d4",color:"white", textAlign:"center"}}>Checking...</Text>
              : <Button
              title="Login"
              bgColor="#06b6d4"
              textColor="#fff"
              onPress={loginButtonHandler}
            />
            }

            <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 10 }}>
              Don't have an account?{' '}
              <Text style={{ fontWeight: 'bold', color: '#06b6d4' }} onPress={() => navigation.navigate('Signup')}>
                Sign up
              </Text>
            </Text>

          </View>
        </View >
      </ImageBackground>
    </SafeAreaView>

  )
})

export default React.memo(Login);