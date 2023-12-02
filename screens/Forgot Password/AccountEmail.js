import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, logOutAccount } from '../../redux/action/LoginAction';
import ToastFunction from '../../config/toastConfig';
import { useEffect } from 'react';
import { styles } from '../../style/styles';
import InputText from '../../components/InputText';

const ForgotPassword = ({ pin, setPin, recoveryData, setRecoveryData, navigation }) => {
	const dispatch = useDispatch();
	const { emailLoading, emailSent, emailSentError } = useSelector((state) => state.login);

	const onChangeHandler = (name, text) => setRecoveryData({ ...recoveryData, [name]: text });

	const submitEmail = () => {
		if (!recoveryData.email) return ToastFunction("error", "Fill up empty field! ");
		const codePin = getRandomNumber();
		setPin(codePin);
		const updatedRecoveryData = { email: recoveryData.email, code: codePin, };
		dispatch(forgotPassword(updatedRecoveryData));
	}

	const getRandomNumber = () => { return Math.floor(Math.random() * 9000) + 1000 };

	useEffect(() => {
		setRecoveryData({ ...recoveryData, email: "" });
		setPin("")
		dispatch(logOutAccount())
	}, []);

	useEffect(() => {
		if (emailSent && recoveryData.email && pin) {
			ToastFunction("success", emailSent);
			navigation.navigate("Verify")
		}
		if (emailSentError) { ToastFunction("error", emailSentError); }
	}, [emailSent, emailSentError]);

	return (
		<SafeAreaView style={{ ...styles.container, backgroundColor: 'white' }}>
			<ScrollView>
				<View style={{ ...styles.containerWhite }}>
					<Text style={{ fontWeight: '500', fontSize: 25, color: '#2b2b2b' }}>Forgot Password</Text>
					<Toast />
					<Image source={require('../../assets/images/undraw_subscribe_vspl.png')} style={{ width: 300, height: 250, zIndex: -50 }} />


					<View style={{ gap: 10, width: '100%', alignItems: 'center' }}>
						<Text style={{ fontWeight: '400', fontSize: 20, textAlign: 'center', color: '#2b2b2b' }}>Enter the email address associated with your account.</Text>
						<Text style={{ fontWeight: '400', fontSize: 15, textAlign: 'center', color: '#cccccc' }}>We will email you a link to reset your password.</Text>
					</View>

					<View style={{ maxHeight: 60, borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8, width: "100%" }}>
						<InputText name="email" onChangeText={onChangeHandler} value={recoveryData.email} placeholder="Enter email address" />
					</View>

					{
						!emailLoading ? <Button title="Send" bgColor="#06b6d4" textColor="#fff" onPress={submitEmail} /> : <Text>Checking...</Text>
					}
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default React.memo(ForgotPassword)