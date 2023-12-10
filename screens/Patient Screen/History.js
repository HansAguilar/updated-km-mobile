import { View, Image, Text, ScrollView, Dimensions } from 'react-native';
import { styles } from '../../style/styles';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import moment from 'moment';
import history from "../../assets/images/history1.png";

const History = ({ navigation }) => {
	const dispatch = useDispatch();
	const { height } = Dimensions.get("screen");
	const patient = useSelector((state) => { return state.patient });
	const appointment = useSelector((state) => { return state.appointment.appointment.filter(val => val.patient.patientId === patient.patient.patientId && (val.status === "DONE" || val.status === "CANCELLED")) });

	return (
		<>
			<View style={{ ...styles.containerGray, position: 'relative', height: "100%" }}>
				<View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>

					{
						appointment.length <= 0 ?
							<View style={{ alignItems: "center", justifyContent: "center", gap: 4 }}>
								<Image source={history} style={{ width: 500, height: 300, resizeMode: "contain" }} />
								<Text style={{ fontSize: 16, fontWeight: "500", color: "#3f3f3f" }}>You have no appointment history.</Text>
								<Text style={{ fontSize: 16, fontWeight: "500", color: "#3f3f3f" }}>Make an appointment now!</Text>
							</View>
							:
							(
								<ScrollView style={{ width: "100%", height: 100, gap: 6 }}>
									{
										appointment.map((val, idx) => (
											<View key={idx} style={{ borderBottomWidth: 1, borderBottomColor: "#ccc", padding: 8, backgroundColor: "#fff" }}>
												<View style={{ padding: 8 }}>
													<View style={{ gap: 6, flexDirection: "row", alignItems: "center" }}>
														<Text style={{ fontSize: 12, fontWeight: "500", color: "#595959" }}>{moment(val.appointmentDate).format("MMM DD, YYYY")}</Text>
														<Text style={{
															fontSize: 12, fontWeight: "500", borderWidth: 1, paddingVertical: 2, paddingHorizontal: 6, borderRadius: 50,
															backgroundColor: val.status === "DONE" ? "#d0fbed" : "#fbd0d0",
															color: val.status === "DONE" ? "#10b981" : "#fbd0d0",
															borderColor: val.status === "DONE" ? "#10b981" : "#fbd0d0"
														}}>{val.status}</Text>
													</View>
													<Text style={{ fontSize: 16, fontWeight: "500", color: "#2b2b2b" }}>{val.status === "DONE" ? `Appointment was successful` : `${val.reasonOfCancellation}`}</Text>
												</View>
											</View>
										))
									}
								</ScrollView>
							)
					}
				</View>
			</View>
		</>
	);
}

export default React.memo(History);