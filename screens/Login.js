import React,{useState, useEffect} from 'react';
import { View, Image, StyleSheet, Text, Dimensions, text } from 'react-native';
import { styles } from '../style/styles';
import Button from '../components/Button';
import InputText from '../components/InputText';
import ToastFunction from '../config/toastConfig';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { loginPatientAccount } from '../redux/action/PatientVerification';
import Loader from '../components/Loader';

const Login = React.memo(({navigation}) => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const {loading, token, error} = useSelector((state)=>{return state.patientVerification});
  const [userData, setUserData] = useState({
    username: '',
    password: ''
  });
  const [isSecure, setSecure] = useState(true);

  const onChangeText = (name, value) => {
    setUserData({ ...userData, [name]: value });
  };

  const checkIfValidAccount = async() =>{
    if(!loading && token){
      await AsyncStorage.setItem('token', token);
      setUserData({ username: '', password: '' })
      navigation.navigate("Patient");
    }
    else if (!loading && error) {
      ToastFunction('error', error);
    }
  }
  useEffect(() => {
    checkIfValidAccount();
  }, [loading, error, token]);

  const loginButtonHandler = () => {
    if (!userData.username || !userData.password) {
      return ToastFunction('error', 'Fill up empty field');
    }
    dispatch(loginPatientAccount(userData));
  };
  return (
      <View style={styles.containerWhite}>
      <Toast />
      <View style={styles.subContainer}>
        <Image
          source={require('../assets/images/logo.jpg')}
          style={styles.bannerImage}
          resizeMode="contain"
        />
        <View style={{ ...styles.inputContainer, marginBottom: 60 }}>
          <InputText
            onChangeText={onChangeText}
            name="username"
            value={userData.username}
            placeholder="Username"
          />
          <InputText
            onChangeText={onChangeText}
            name="password"
            value={userData.password}
            placeholder="Password"
            isSecure={isSecure}
            iconName={isSecure ? 'eye-with-line' : 'eye'}
            iconFunction={() => setSecure((prev) => !prev)}
            iconColor="#4b5563"
          />
          <Text
            style={{ textAlign: 'right', fontSize: 14, color: '#06b6d4', marginTop: 5 }}
          >
            Forgot password?
          </Text>
        </View>
        <Button
          title="Login"
          bgColor="#06b6d4"
          textColor="#fff"
          onPress={loginButtonHandler}
        />
        <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 10 }}>
          Don't have an account?{' '}
          <Text
            style={{ fontWeight: 'bold', color: '#06b6d4' }}
            onPress={() => navigation.navigate('Signup')}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  )
})

export default Login;