import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { approvedDentistAppointment } from "../redux/action/AppointmentAction";
import Octicons from "react-native-vector-icons/Octicons";
import { useDispatch } from 'react-redux';
import nopatient from "../assets/images/todayspatients.png";

function DentistCard({ header, data, setModal, setTreatmentData, setAppointmentId, navigation }) {
	const [dropToggle, setDropToggle] = useState(false);
	const dispatch = useDispatch();
	return (
		<View style={{ width: "100%", padding: 15, height: "auto" }}>

			<Text style={{ fontSize: 18, fontWeight: '500', color: '#3f3f46' }}>{header}</Text>
			<ScrollView style={{ width: "100%", height: 200, paddingBottom:50}}>
				{
					data.length > 0 ?
						data.map((val, idx) => (
							<View key={idx} style={{ width: "100%", backgroundColor: "white", height: "auto", padding: 10, display: 'flex', flexDirection: 'row', columnGap: 10, marginTop: 10, }}>
								<Image source={{ uri: val.patient.profile }} style={{ width: 40, height: 40, borderRadius: 100 }} />
								{/* LEFT */}
								<View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>
									<View>
										<Text style={{ fontSize: 14 }}>{val.patient.firstname} {val.patient.lastname}</Text>
										<Text style={{ fontSize: 12, color: "#06b6d4", fontWeight: 'bold', textTransform: 'capitalize', paddingVertical: 3, textDecorationLine: 'underline' }}
											onPress={() => {
												navigation.navigate("Patient History", { patientId: val.patient.patientId })
											}}>View Patient History</Text>

									</View>
									{
										(val.status === "PROCESSING" || val.status === "TREATMENT_PROCESSING") && (
											<View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>

												{
													val.status === "PROCESSING" && (
														<Pressable style={{ padding: 10, backgroundColor: "#10b981", borderRadius: 100 }} onPress={() => {
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


												{/* <AntIcon name='down' size={20} onPress={()=>setDropToggle(!dropToggle)} /> */}
												{/* <Text style={{ backgroundColor:"#06b6d4",color:"white",paddingHorizontal:15, paddingVertical:3,borderRadius:100 }}>Treatment</Text>
                                            <Text style={{ backgroundColor:"#10b981",color:"white",paddingHorizontal:15, paddingVertical:3,borderRadius:100 }}>Done</Text> */}

												{/* </>
                                        )
                                    } */}
											</View>
										)
									}
								</View>
							</View>
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