import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, SafeAreaView, TouchableHighlight } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { approvedDentistAppointment } from "../redux/action/AppointmentAction";
import Octicons from "react-native-vector-icons/Octicons";
import { useDispatch } from 'react-redux';
import nopatient from "../assets/images/todayspatients.png";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

function DentistCard({ header, data, setModal, setTreatmentData, setAppointmentId, navigation, selectedItem, showPopUp, handleShowPopUp }) {
	const dispatch = useDispatch();
	return (
		<View style={{ width: "100%", padding: 15, height: "auto" }}>

			<Text style={{ fontSize: 18, fontWeight: '500', color: '#3f3f46' }}>{header}</Text>
			<ScrollView style={{ width: "100%", marginVertical: 15 }}>

				{
					data.length > 0 ?
						data.map((val, idx) => (
							<TouchableHighlight key={idx} style={{ borderRadius: 6 }} onPress={() => { navigation.navigate("Patient History", { patientId: val.patient.patientId }) }}>

								<View style={{ position: "relative", borderRadius: 6, backgroundColor: "#fff", width: '100%', padding: 10, borderColor: "#e6e6e6", borderWidth: 1, alignItems: "center", flexDirection: 'row', gap: 10, elevation: 1, shadowRadius: 6 }}>

									{/* //~ IMAGE DENTIST */}
									<Image source={{ uri: val.patient.profile }} style={{ width: 50, height: 50, borderRadius: 50 }} />
									{/* //~ IMAGE DENTIST */}

									<Text style={{ fontSize: 14, color: "#bfbfbf", fontWeight: "500", flex: 1 }}>{val.patient.firstname} {val.patient.lastname}</Text>

									{/* //~ THREE DOTS */}
									{/* <Pressable style={{ zIndex: 40 }} onPress={() => handleShowPopUp(idx)}>
										<SimpleLineIcons name="options-vertical" size={20} color="#bfbfbf" />
									</Pressable> */}
									{/* //~ THREE DOTS */}

									{/* {
										// val.status === "PROCESSING" || val.status === "TREATMENT_PROCESSING" &&
										(showPopUp || idx === selectedItem) && (
											<SafeAreaView style={{ backgroundColor: '#fff', flexDirection: 'column', position: 'relative', zIndex: 50, top: -65, right: 15, borderWidth: 1, borderColor: "#e6e6e6", borderRadius: 4, }}>
												{
													(val.status === "PROCESSING" || val.status === "TREATMENT_PROCESSING") && (
														<TouchableHighlight style={{ paddingHorizontal: 50, paddingVertical: 12, borderBottomColor: '#d9d9d9', borderBottomWidth: 1, }} onPress={() => {
															setTreatmentData(val);
															setModal(true);
														}}>
															<Text style={{ ...cardStyles.buttonText, letterSpacing: 0.2 }}>Update</Text>
														</TouchableHighlight>
													)
												}

												<TouchableHighlight style={{ paddingHorizontal: 50, paddingVertical: 12, }} onPress={() => dispatch(approvedAppointment(val.appointmentId))}>
													<Text style={{ ...cardStyles.buttonText }}>Done</Text>
												</TouchableHighlight>

												<TouchableHighlight style={{ paddingHorizontal: 50, paddingVertical: 12, }} onPress={() => handleShowPopUp("")}>
													<Text style={{ ...cardStyles.buttonText, color: '#ff6666' }}>Close</Text>
												</TouchableHighlight>
											</SafeAreaView>
										)
									} */}

									{
										(val.status === "PROCESSING" || val.status === "TREATMENT_PROCESSING") && (
											<View style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: "center" }}>
												{
													val.status === "PROCESSING" && (
														<Pressable style={{ padding: 10, backgroundColor: "#10b981", borderRadius: 100, alignItems: "center" }} onPress={() => {
															setTreatmentData(val);
															setModal(true);
														}}>
															<Octicons name='checklist' size={20} color={"#fff"} />
														</Pressable>
													)
												}


												<Pressable style={{ padding: 10, backgroundColor: "#06b6d4", borderRadius: 100 }} onPress={()=>dispatch(approvedDentistAppointment(val.appointmentId))}>
													<MaterialIcons name='done' size={20} color={"#fff"} />
												</Pressable>
											</View>
										)
									}
								</View>
							</TouchableHighlight>
						))
						:
						<View style={{ width: '100%', alignItems: "center" }}>
							<Image source={nopatient} style={{ width: 200, height: 200, resizeMode: "contain" }} />
							<Text style={{ color: '#a1a1aa', fontSize: 12, fontWeight: 'normal' }}>No appointments scheduled for today.</Text>
						</View>
				}
			</ScrollView>
		</View>
	);
}

export default DentistCard;

const cardStyles = {
	buttonContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
	},
	button: {
		width: 100, // Set a fixed width for the buttons
		backgroundColor: '#0284c7',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 5,
		marginVertical: 5, // Add marginVertical for spacing between buttons
	},
	buttonView: {
		width: 100, // Set a fixed width for the buttons
		backgroundColor: 'gray',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 5,
		marginVertical: 5, // Add marginVertical for spacing between buttons
	},
	buttonText: {
		color: '#666666',
		fontSize: 13,
		fontWeight: '500',
		textAlign: 'center', // Center the text within the button

	},
	cancelButton: {
		width: 100, // Set a fixed width for the buttons
		backgroundColor: "#ef4444",
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 5,
		marginVertical: 5, // Add marginVertical for spacing between buttons
	},
};

