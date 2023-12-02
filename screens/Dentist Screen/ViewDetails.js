import React, { useState } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from "../../style/styles";
import InputText from '../../components/InputText';
import Toast from 'react-native-toast-message';
import ToastFunction from "../../config/toastConfig";
import * as ImagePicker from 'expo-image-picker';
import { updateDentistInfo } from "../../redux/action/DentistAction";
import blurprofile from "../../assets/images/blurprofile.png";
import AntDesign from "react-native-vector-icons/AntDesign";

function ViewDetails({ navigation }) {
	const { width, height } = Dimensions.get("screen");
	const { activeDentist } = useSelector((state) => { return state.dentist; });
	const [data, setData] = useState({
		profile: activeDentist.profile,
		fullname: activeDentist.fullname,
		address: activeDentist.address,
		contactNumber: activeDentist.contactNumber,
		email: activeDentist.email,
		password: null,
	});
	const [modal, setModal] = useState(false);
	const dispatch = useDispatch();

	const onChangeText = (name, value) => {
		setData({ ...data, [name]: value });
	};

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
		setData({ ...data, profile: base64Image });
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

	const submitButton = () => {
		if (!data.fullname || !data.address || !data.contactNumber || !data.email) {
			return ToastFunction("error","Fill empty field!");
		}
		if (/[^\w\s]/.test(data.fullname)) {
			return ToastFunction("error","Invalid characters for fullname!");
		}
		if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(data.email)) {
			return ToastFunction("error","Invalid email!");
		}
		const regex = /^09\d{9}$/;
		if (!regex.test(data.contactNumber)) {
			return ToastFunction("error","Contact number must be 11-digit and must start with 09");
		}
		dispatch(updateDentistInfo(activeDentist.dentistId, data, ToastFunction,navigation));
	}

	const cancelButton = () => {
		navigation.navigate("Dashboard");
	}

	const ChangePasswordModal = () => {
		const [passwordInfo, setPasswordInfo] = useState({
			password: "",
			confirmPassword: null
		});
		const [isSecure, setSecure] = useState({
			password: true,
			confirmPassword: true
		});

		const onChangePassword = (name, value) => {
			setPasswordInfo({ ...passwordInfo, [name]: value });
		};

		const submitPassword = () => {
			if (!passwordInfo.confirmPassword || !passwordInfo.password) {
				return ToastFunction("error","Fill up empty field!");
			}

			if (passwordInfo.password !== passwordInfo.confirmPassword) {
				return ToastFunction("error","Mismatch password and confirmPassword!");
			}

			if (passwordInfo.password.length <= 7 || passwordInfo.confirmPassword.length <= 7) {
				return ToastFunction("error","Password must be 8 characters");
			}

			setData({ ...data, password: passwordInfo.password });
			setModal(false);
		}

		return (
			<View style={{ height: "100%", width: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", position: 'absolute', zIndex: 10, padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

				<View style={{ width: "100%", height: "auto", maxHeight: 600, backgroundColor: "white", padding: 20, borderRadius: 10, zIndex: -10, gap: 10 }}>
					<Text style={{ fontSize: 18, fontWeight: "bold" }}>Change New Password</Text>

					<View style={{ width: "100%", marginTop: 10 }}>
						<Text style={{ fontSize: 12, marginBottom: 5 }}>Password</Text>
						<View style={{
							borderColor: "#e6e6e6",
							borderWidth: 1, padding: 0,
							borderRadius: 4,
						}}>
							<InputText
							    name="password"
								value={passwordInfo.password}
								onChangeText={onChangePassword}
								isSecure={isSecure.password}
								iconName={isSecure.password ? 'eye-with-line' : 'eye'}
								iconFunction={() => setSecure({ ...isSecure, password: !isSecure.password })}
								iconColor="#4b5563"
							/>
						</View>
					</View>

					<View style={{ width: "100%", marginTop: 10 }}>
						<Text style={{ fontSize: 12, marginBottom: 5 }}>Confirm Password</Text>
						<View style={{
							borderColor: "#e6e6e6",
							borderWidth: 1, padding: 0,
							borderRadius: 4,
						}}>
							<InputText
								onChangeText={onChangePassword}
								name="confirmPassword"
								value={passwordInfo.confirmPassword}
								isSecure={isSecure.confirmPassword}
								iconName={isSecure.confirmPassword ? 'eye-with-line' : 'eye'}
								iconFunction={() => setSecure({ ...isSecure, confirmPassword: !isSecure.confirmPassword })}
								iconColor="#4b5563"
							/>
						</View>
					</View>

					<View style={{ width: "100%", display: 'flex', flexDirection: 'row', gap: 10, paddingTop: 10 }}>
						<Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#ef4444", color: "#fff", borderRadius: 6 }} onPress={() => setModal(false)}>Cancel</Text>
						<Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#06b6d4", color: "#fff", borderRadius: 6 }} onPress={submitPassword}>Save Changes</Text>
					</View>
				</View>
			</View>
		)
	}

	return data && (
		<>
			{modal && <ChangePasswordModal />}
			<View style={{ ...styles.containerGray, height: height, width: width, position: 'relative' }}>
				<ScrollView contentContainerStyle={{ width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
					<Toast />

					<Image source={blurprofile} style={{ backgroundColor: "#06a9c6", position: "absolute", width: "100%", height: 220, top: 0, resizeMode: "cover", zIndex: -20 }}></Image>

					{/* IMAGE */}
					<View style={{ width: "100%", alignItems: "center", padding: 20, zIndex: -10 }}>
						<Pressable style={{ position: "relative", zIndex: -60, borderRadius: 100 }} onPress={handleImageUpload}>
							<View style={{ position: "absolute", bottom: 0, right: 5, backgroundColor: "#08d3f7", zIndex: 40, borderRadius: 50, padding: 4 }}>
								<AntDesign name='plus' size={20} color="#ffff" />
							</View>
							<Image source={{ uri: data.profile }} style={{ width: 100, height: 100, borderWidth: 1, borderColor: '#08d3f7', borderRadius: 50 }} />
						</Pressable>
					</View>


					<View style={{ backgroundColor: "#fff", width: "90%", padding: 20, borderRadius: 8, gap: 14, marginVertical: 20, elevation: 1 }}>
						<Text style={{ fontSize: 16, color: "#4d4d4d", fontWeight: 'bold' }}>Update information</Text>

						{/* DENTIST */}
						<View style={{ width: "100%", gap: 4 }}>
							<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Full Name</Text>
							<TextInput onChangeText={(text)=>onChangeText("fullname", text)} name="fullname" value={data.fullname} style={{ ...style.inputTextStyle }} />
						</View>

						{/* Address */}
						<View style={{ width: "100%", gap: 4 }}>
							<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Address</Text>
							<TextInput onChangeText={(text)=>onChangeText("address", text)} name="address" value={data.address} style={{ ...style.inputTextStyle }} />
						</View>

						{/* Contact Number */}
						<View style={{ width: "100%", gap: 4 }}>
							<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Contact Number</Text>
							<TextInput onChangeText={(text)=>onChangeText("contactNumber", text)} name="contactNumber" value={data.contactNumber} style={{ ...style.inputTextStyle }} />
						</View>

						{/* Email */}
						<View style={{ width: "100%", gap: 4 }}>
							<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Email</Text>
							<TextInput onChangeText={(text)=>onChangeText("email", text)} name="email" value={data.email} style={{ ...style.inputTextStyle }} />
						</View>

						{
							!data.password && (<Text style={{ width: "100%", paddingVertical: 10, color: "#06b6d4", fontWeight: 'bold', textDecorationLine: 'underline', marginTop: 5 }} onPress={() => setModal(true)}>Change password?</Text>)
						}
						{
							data.password && (
								<View style={{ width: "100%", marginTop: 10 }}>
									<Text style={{ fontSize: 12, marginBottom: 5 }}>Password</Text>
									<InputText
										name="password"
										value={data.password}
										isSecure={true}
										isEditable={false}
										iconColor="#4b5563"
									/>
								</View>
							)
						}

						<View style={{ width: "100%", display: 'flex', flexDirection: 'row', gap: 10 }}>
							<Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#ef4444", color: "#fff", borderRadius: 6 }} onPress={cancelButton}>Cancel</Text>
							<Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#06b6d4", color: "#fff", borderRadius: 6 }} onPress={submitButton}>Save Changes</Text>
						</View>

					</View>
					<Toast />
				</ScrollView>

			</View>
		</>
	)
}

export default ViewDetails;

const style = {
	inputTextStyle: {
		borderColor: "#e6e6e6",
		borderWidth: 1, padding: 4,
		borderRadius: 4, paddingLeft: 10
	}
}