import { View, Pressable, Text, ScrollView, Dimensions, Image } from 'react-native';
import { styles } from '../../style/styles';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from "react-native-vector-icons/AntDesign";
import React, { useEffect } from 'react';
import moment from 'moment';
import noprescription from "../../assets/images/prescription.png";
import { fetchPrescription } from "../../redux/action/PrescriptionAction"
import Loader from '../../components/Loader';

const Prescription = ({ setPrescriptionDetails, navigation }) => {
	const dispatch = useDispatch();
	const { height } = Dimensions.get("screen");
	const prescription = useSelector((state) => { return state?.prescription?.prescription });
	const patient= useSelector((state) => { return state.patient.patient });

	useEffect(()=>{
		dispatch(fetchPrescription(patient.patientId))
	},[]);

	return prescription && (
		<>
			{prescription?.loading && (<Loader loading={prescription.loading} />)}
			{
				!prescription?.loading && (
					<View style={{ ...styles.containerGray, position: 'relative' }}>
						<View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
							{
								prescription.length <= 0 ?
									<View style={{ alignItems: "center", gap: 15 }}>
										<Image source={noprescription} style={{ width: 300, height: 300 }} />
										<Text style={{ fontSize: 16, fontWeight: "500", color: "#3f3f3f" }}>No new prescriptions from your dentist yet!</Text>
									</View>
									: (
										<ScrollView style={{ width: "100%", height: 100, gap: 6, padding: 20 }}>
											{
												prescription.map((val, idx) => (
													<View style={{ gap: 4 }} key={idx}>
														<Text style={{ fontSize: 12, fontWeight: "500", color: "#595959" }}>{moment(val.date).format("MMMM M, YYYY")}</Text>


														<Pressable
															style={{ gap: 8, width: "100%", backgroundColor: "#fff", borderRadius: 6, padding: 16, elevation: 1, shadowRadius: 6, alignItems: "center", flexDirection: "row" }}
															key={idx}
															onPress={() => {
																setPrescriptionDetails(val);
																navigation.navigate("Prescription Details");
															}}
														>
															<AntDesign name='file1' size={40} />
															<View style={{ flexDirection: "column", alignItems: "flex-start" }}>
																<Text style={{ fontSize: 16, fontWeight: "500", color: "#2b2b2b" }}>Your Prescription</Text>
																<View style={{ flexDirection: "row", alignItems: "flex-start" }}>
																	<Text style={{ fontSize: 13, fontWeight: "500", color: "#595959" }}>From </Text>
																	<Text style={{ fontSize: 13, fontWeight: "600", color: "#06b6d4" }}>Dr. {val.dentist.fullname}</Text>
																</View>
															</View>
														</Pressable>
													</View>

												))
											}
										</ScrollView>
									)
							}
						</View>
					</View>
				)
			}
		</>
	);
}

export default React.memo(Prescription);