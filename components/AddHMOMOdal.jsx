import React, { useState } from 'react';
import { Text, StyleSheet, View, Dimensions, TextInput, ScrollView, Pressable } from 'react-native';
import ToastFunction from '../config/toastConfig';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useDispatch } from 'react-redux';
import { createInsurance } from '../redux/action/InsuranceAction';
import AntDesign from "react-native-vector-icons/AntDesign";

export default function HMOModal({ patientId, setModal }) {
	const dispatch = useDispatch();
	const { width } = Dimensions.get("screen");
	const [cardInfo, setCardInfo] = useState({
		card: "",
		isCardActive: false,
		cardNumber: "",
		company: "",
	})
	const availableHMOList = [
		"Cocolife Health Care",
		"Inlife Insular Health Care",
		"Health Partners Dental Access, Inc.",
		"Maxicare",
		"eTiQa",
		"PhilCare",
		"Health Maintenance, Inc.",
		"Generali",
		"Health Access",
	];

	const handleChange = (name, text) => setCardInfo({ ...cardInfo, [name]: text })

	const cancelButton = (name, text) => {
		setCardInfo({ card: "", isCardActive: false, cardNumber: "", company: "" });
		setModal(false)
	}

	const submitButton = () => {
		if (!cardInfo.card) return ToastFunction("error", "Select first your hmo card");
		if (!cardInfo.company || !cardInfo.cardNumber) return ToastFunction("error", "Fill up empty field");
		dispatch(createInsurance(patientId, cardInfo));
		setModal(false)
	}

	return (
		<View style={{ height: "100%", width: width, backgroundColor: "rgba(0, 0, 0, 0.5)", position: 'absolute', zIndex: 10, padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<View style={{ width: "100%", minHeight: 450, maxHeight: 450, backgroundColor: "white", padding: 20, borderRadius: 10, zIndex: -10, paddingBottomBottom: 20, position: "relative", alignItems: "center", gap: 10 }}>

				{/* CARD NAME */}
				<View style={{ gap: 6, width: "100%" }}>
					<Text style={{ fontSize: 18, borderBottomWidth: 1, borderBottomColor: "#CCC", paddingBottom: 10, marginBottom: 10 }}>Add Card</Text>
					<View style={{ gap: 6 }}>
						<Text style={{ fontSize: 12, fontWeight: "500", color: "#666666" }}>Card Name:</Text>

						<Pressable style={{ ...styles.dropdownStyle, borderColor: "#e6e6e6", borderWidth: 1 }} onPress={() => setCardInfo(prev => ({ ...prev, isCardActive: !prev.isCardActive }))}>
							<View style={{ padding: 14, justifyContent: "space-between", flexDirection: "row", width: "100%", alignItems: "center" }}>
								<Text style={{ fontSize: 14, textTransform: 'capitalize' }}>{cardInfo.card ? cardInfo.card : "Select card name..."}</Text>
								<AntDesign name={cardInfo.isCardActive ? "down" : "up"} color="#2b2b2b" />
							</View>
						</Pressable>
					</View>

					{
						cardInfo.isCardActive && (
							<ScrollView style={{ width: "100%", height: 200, borderWidth: .5, borderColor: "#ccc", borderRadius: 6 }}>
								{
									availableHMOList.map((val, idx) => (
										<Pressable style={{ ...styles.subDropdownStyle }} key={idx} onPress={() => setCardInfo({ ...cardInfo, card: val, isCardActive: false })}>
											<Text style={{ fontSize: 14, color: "#2b2b2b", paddingHorizontal: 18, paddingVertical: 8 }}>{val}</Text>
										</Pressable>
									))
								}
							</ScrollView>
						)
					}
				</View>

				{
					cardInfo.card && !cardInfo.isCardActive && (
						<View style={{ width: "100%", gap: 6 }}>

							{/* CARD NUMBER */}
							<View style={{ gap: 6, width: "100%" }}>
								<Text style={{ fontSize: 12, fontWeight: "500", color: "#666666" }}>Card Number:</Text>
								<TextInput name="cardNumber" value={cardInfo.cardNumber} onChangeText={(text) => handleChange("cardNumber", text)} style={{ ...styles.inputTextStyle }} placeholder='ex. 1234 4567 789' />
							</View>

							{/* COMPANY */}
							<View style={{ gap: 6, width: "100%" }}>
								<Text style={{ fontSize: 12, fontWeight: "500", color: "#666666" }}>Company (Type N/A if none):</Text>
								<TextInput name="company" value={cardInfo.company} onChangeText={(text) => handleChange("company", text)} style={{ ...styles.inputTextStyle }} placeholder='ex. STI Caloocan' />
							</View>
						</View>
					)
				}

				<View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', width: "100%", columnGap: 10, position: "absolute", bottom: 20, alignItems: "center" }}>
					<Text
						style={{ backgroundColor: "#ef4444", color: "white", flex: 1, paddingVertical: 12, textAlign: 'center', borderRadius: 6 }}
						onPress={cancelButton}
					>Cancel</Text>
					<Text
						style={{ backgroundColor: "#10b981", color: "white", flex: 1, paddingVertical: 12, textAlign: 'center', borderRadius: 6 }}
						onPress={submitButton}
					>Add Card</Text>
				</View>
			</View>
			<Toast />
		</View>
	)
}

const styles = {
	dropdownStyle: {
		width: '100%',
		height: 'auto',
		backgroundColor: '#fff',
		borderRadius: 6,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
		overflow: 'hidden',
	},

	subDropdownStyle: {
		width: '100%',
		shadowColor: "#CCC",
		justifyContent: "space-between",
		flexDirection: "row", width: "100%", alignItems: "center",
		borderWidth: 1,
		borderColor: "#CCC",
		padding: 6
	},

	subSubDropdown: {
		padding: 15, width: '100%', backgroundColor: '#fff',
		display: 'flex', flexDirection: 'row',
		alignItems: 'center',
		columnGap: 10,
		elevation: 1,
		shadowRadius: 6,
		borderBottomWidth: 1,
		borderBottomColor: "#CCC"
	},
	inputTextStyle: {
		borderColor: "#e6e6e6",
		borderWidth: 1, padding: 10,
		borderRadius: 4, paddingLeft: 10
	}
}