import React from 'react';
import { View, Text, SafeAreaView, ImageBackground, Image, TextInput } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Button from '../../components/Button';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, logOutAccount } from '../../redux/action/LoginAction';
import ToastFunction from '../../config/toastConfig';
import { useEffect } from 'react';
import { styles } from '../../style/styles';
import InputText from '../../components/InputText';
import { parse } from 'react-native-svg';

const ForgotPassword = ({ pin, setPin, recoveryData, setRecoveryData, navigation }) => {
	const dispatch = useDispatch();
	const [enteredPin, setEnteredPin] = useState({
		first: "",
		second: "",
		third: "",
		fourth: "",
	})
	const [timer, setTimer] = useState(60); // Initial timer value in seconds
	const [isTimerRunning, setIsTimerRunning] = useState(false);

	const getRandomNumber = () => { return Math.floor(Math.random() * 9000) + 1000 };

	useEffect(() => {
		if (!isTimerRunning) {
			startTimer();
		}
		if (isTimerRunning) {
			const countdown = setTimeout(() => {
				if (timer > 0) {
					setTimer((prevTimer) => prevTimer - 1);
				}
			}, 1000);
			if (timer === 0) return setPin("");
			return () => clearTimeout(countdown);
		}
	}, [isTimerRunning, timer]);

	const handleOnChange = (name, text) => setEnteredPin({ ...enteredPin, [name]: `${text}` });

	const startTimer = () => {
		setTimer(60);
		setIsTimerRunning((prev) => !prev);
	};

	const resendButton = () => {
		const codePin = getRandomNumber();
		setPin(codePin);
		const updatedRecoveryData = { email: recoveryData.email, code: codePin, };
		dispatch(forgotPassword(updatedRecoveryData));
		startTimer();
	}

	const verifyButton = () => {
		if (!enteredPin.first || !enteredPin.second || !enteredPin.third || !enteredPin.fourth) {
			return ToastFunction("error", "Please fill up empty field!");
		}

		if (!pin) return ToastFunction("error", "Invalid code, kindly click the resend button");

		const pins = `${pin}`.split('');
		if (enteredPin.first !== pins[0] || enteredPin.second !== pins[1] || enteredPin.third !== pins[2] && enteredPin.fourth !== pins[3]) {
			return ToastFunction("error", "Incorrect code");
		}
		navigation.navigate("Password");
	}

	return (
		<SafeAreaView style={{ ...styles.container, backgroundColor: 'white' }}>
			<View style={styles.containerWhite}>
				<Text style={{ fontWeight: '500', fontSize: 25, color: '#2b2b2b' }}>Verification</Text>
				<Toast />
				<Image source={require('../../assets/images/undraw_subscribe_vspl.png')} style={{ width: 300, height: 250, zIndex: -40 }} />

				<Text style={{ fontWeight: '400', fontSize: 20, textAlign: 'center', color: '#2b2b2b' }}>Enter the verification code we just sent on your email address.</Text>

				{/* INPUT BOXES */}
				<View style={{ flexDirection: 'row', width: '80%', gap: 10 }}>

					<TextInput value={enteredPin.first} onChangeText={(text) => handleOnChange("first", text)} keyboardType={"phone-pad"} style={{ padding: 10, fontSize: 20, borderBottomColor: '#06b6d4', borderBottomWidth: 2, flexGrow: 1, textAlign: 'center' }} maxLength={1} />

					<TextInput value={enteredPin.second} onChangeText={(text) => handleOnChange("second", text)} keyboardType={"phone-pad"} style={{ padding: 10, fontSize: 20, borderBottomColor: '#06b6d4', borderBottomWidth: 2, flexGrow: 1, textAlign: 'center' }} maxLength={1} />

					<TextInput value={enteredPin.third} onChangeText={(text) => handleOnChange("third", text)} keyboardType={"phone-pad"} style={{ padding: 10, fontSize: 20, borderBottomColor: '#06b6d4', borderBottomWidth: 2, flexGrow: 1, textAlign: 'center' }} maxLength={1} />

					<TextInput value={enteredPin.fourth} onChangeText={(text) => handleOnChange("fourth", text)} keyboardType={"phone-pad"} style={{ padding: 10, fontSize: 20, borderBottomColor: '#06b6d4', borderBottomWidth: 2, flexGrow: 1, textAlign: 'center' }} maxLength={1} />
				</View>

				{
					timer > 0
						? <Text>Try to resend data after <Text style={{ color: "red" }}>{timer}</Text> seconds</Text>
						: <Text>Didn't receive the code? <Text style={{ color: "red" }} onPress={resendButton}>Resend</Text></Text>
				}
				<Button title="Verify" bgColor="#06b6d4" textColor="#fff" onPress={verifyButton} />
			</View>
		</SafeAreaView>
	)
}

export default React.memo(ForgotPassword)