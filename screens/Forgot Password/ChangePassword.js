import React from 'react';
import { View, Text, SafeAreaView, ImageBackground, Image, TextInput } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Button from '../../components/Button';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, logOutAccount } from '../../redux/action/LoginAction';
import ToastFunction from '../../config/toastConfig';
import { useEffect } from 'react';
import { styles } from '../../style/styles';
import InputText from '../../components/InputText';

const ForgotPassword = ({recoveryData,navigation}) => {
	const dispatch = useDispatch();
	const [password, setPassword] = useState({
        newPassword: "",
        confirmPassword:"",
    })
    const { passwordLoading, passwordResult, passwordError } = useSelector((state)=>state.login);
	
    const onChangeHandler = (name, text)=>setPassword({...password, [name]:text});

    const submitButton = () =>{
        if(!password.newPassword && !password.confirmPassword){
            ToastFunction("error", "Fill up empty field")
        }
        if(password.newPassword !== password.confirmPassword){
            ToastFunction("error", "Password Mismatch")
        }
        const dataPass = { password: password.newPassword }
        dispatch(changePassword(recoveryData.email, dataPass))
    }

    useEffect(()=>{
        if(!recoveryData.email){
            navigation.navigate("Email")
        }
    },[])

    useEffect(()=>{
        if(passwordResult){
            ToastFunction("success", passwordResult);
            dispatch(logOutAccount())
            navigation.navigate("Login");
        }
        if(passwordError){
            ToastFunction("error", passwordError);
        }
    },[passwordResult, passwordError])

	return (
		<SafeAreaView style={{ ...styles.container, backgroundColor: 'white' }}>
            <Toast/>
			<View style={styles.containerWhite}>
                <View style={{ maxHeight: 60, borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8, width: "100%" }}>
                        <InputText name="newPassword" onChangeText={onChangeHandler} value={password.newPassword} isSecure={true} placeholder="New-Password" /> 
                    </View>
                    
                    <View style={{ maxHeight: 60, borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8, width: "100%" }}>
                        <InputText name="confirmPassword" onChangeText={onChangeHandler} value={password.confirmPassword} isSecure={true} placeholder="Confirm Password" />
                    </View>
                    {
                        !passwordLoading ? <Button title="Save" bgColor="#06b6d4" textColor="#fff" onPress={submitButton}/> : <Text>Saving...</Text>
                    }
                </View>
		</SafeAreaView>
	)
}

export default React.memo(ForgotPassword)