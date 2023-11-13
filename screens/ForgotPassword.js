import { View, Text, SafeAreaView, ImageBackground, Image, TextInput } from 'react-native';
import { styles } from '../style/styles';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import InputText from '../components/InputText';
import Button from '../components/Button';
import { useState } from 'react';

const ForgotPassword = () => {
	const [isSent, setIsSent] = useState(false);

	return (
		<SafeAreaView style={{ ...styles.container, backgroundColor: 'white' }}>
			<Toast />

			<View style={styles.containerWhite}>

				<Text style={{ fontWeight: '500', fontSize: 25, color: '#2b2b2b' }}>
					{
						isSent ? "Forgot Password?" : "Verification"
					}
				</Text>

				<Image source={require('../assets/images/undraw_subscribe_vspl.png')} style={{ width: 300, height: 250 }} />
				<View style={{ gap: 10, width: '100%', alignItems: 'center' }}>
					{
						isSent ?
							<>
								<Text style={{ fontWeight: '400', fontSize: 20, textAlign: 'center', color: '#2b2b2b' }}>Enter the email address {"\n"} associated with your account.</Text>
								<Text style={{ fontWeight: '400', fontSize: 15, textAlign: 'center', color: '#cccccc' }}>We will email you a link to reset {"\n"} your password.</Text>
							</>
							:
							<>
								<Text style={{ fontWeight: '400', fontSize: 20, textAlign: 'center', color: '#2b2b2b' }}>Enter the verification code we just sent on your email address.</Text>
								<View style={{ flexDirection: 'row', width: '80%', gap: 10 }}>
									<TextInput style={{ padding: 10, fontSize: 20, borderBottomColor: '#06b6d4', borderBottomWidth: 2, flexGrow: 1, textAlign: 'center' }} maxLength={1} />
									<TextInput style={{ padding: 10, fontSize: 20, borderBottomColor: '#06b6d4', borderBottomWidth: 2, flexGrow: 1, textAlign: 'center' }} maxLength={1} />
									<TextInput style={{ padding: 10, fontSize: 20, borderBottomColor: '#06b6d4', borderBottomWidth: 2, flexGrow: 1, textAlign: 'center' }} maxLength={1} />
									<TextInput style={{ padding: 10, fontSize: 20, borderBottomColor: '#06b6d4', borderBottomWidth: 2, flexGrow: 1, textAlign: 'center' }} maxLength={1} />
								</View>
							</>
					}
				</View>

				{
					isSent ?
						<View style={{ maxHeight: 60, borderWidth: 2, borderColor: '#CCCCCC', borderRadius: 8, width: "100%" }}>
							<InputText placeholder="Enter email address" />
						</View>
						:
						<View style={{ marginVertical: 10 }}>
							<Text style={{ fontWeight: '400', fontSize: 15, textAlign: 'center', color: '#cccccc' }}>
								Didn't receive the code?
								<Text style={{ fontWeight: '400', fontSize: 15, textAlign: 'center', color: '#06b6d4' }}> Resend</Text>
							</Text>
						</View>
				}


				<Button
					title="Send"
					bgColor="#06b6d4"
					textColor="#fff"
				/>
			</View>

		</SafeAreaView>
	)
}

export default ForgotPassword