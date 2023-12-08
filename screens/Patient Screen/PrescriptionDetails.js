import { SafeAreaView, View, Text, Image, ScrollView } from 'react-native';
import { styles } from '../../style/styles';
import React from 'react';
import moment from 'moment';
import kmlogo from "../../assets/images/kmlogo.jpg";
import Ionicons from "react-native-vector-icons/Ionicons";

const Prescription = ({ prescriptionDetails, navigation }) => {
	const dentist = prescriptionDetails.dentist.fullname.split(' ').pop();
	return prescriptionDetails && (
		<SafeAreaView style={{ flex: 1, height: "100%", backgroundColor: "#fff" }}>
			<ScrollView contentContainerStyle={{ flex: 1 }}>

				<View style={{ width: "100%", height: "100%", padding: 20, position: 'relative' }}>

					<View style={{ padding: 4, alignItems: "center" }}>
						<View style={{ borderBottomColor: "#CCC", borderBottomWidth: 2, width: "100%" }}>
							<View style={{ width: "100%" }}>
								<Image
									source={kmlogo}
									style={{ width: "100%", height: 80 }}
									resizeMode="contain"
								/>
							</View>
							{/* <Text style={{ fontWeight: "500", fontSize: 16, paddingVertical: 2 }}>Kristie Marren V. Geronimo, DMD</Text> */}
							<View style={{ padding: 10, gap: 8 }}>
								<View style={{ justifyContent: "space-between", flexDirection: "column", gap: 6 }}>
									<View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
										<Ionicons name='location-outline' size={18} />
										<Text style={{ fontSize: 12, fontWeight: "500", color: "#3f3f3f" }}>47 General Luna St., cor Garcia St., Brgy. San Agustin, Malabon City</Text>
									</View>
									<View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
										<Ionicons name='call-outline' size={18} />
										<View style={{ flexDirection: "row", gap: 12 }}>
											<Text style={{ fontSize: 12, fontWeight: "500", color: "#3f3f3f" }}>Smart: 0912 060 0101</Text>
											<Text style={{ fontSize: 12, fontWeight: "500", color: "#3f3f3f" }}>Globe: 0912 060 0101</Text>
										</View>
									</View>
								</View>
							</View>
						</View>

						<View style={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 10 }}>
							<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
								<View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
									<Text style={{ fontSize: 14, color: "#2b2b2b", fontWeight: "bold" }}>Name:</Text>
									<Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f", textDecorationLine: "underline" }}>{prescriptionDetails.patient.firstname} {prescriptionDetails.patient.lastname}</Text>
								</View>
								<View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
									<Text style={{ fontSize: 14, color: "#2b2b2b", fontWeight: "bold" }}>Age:</Text>
									<Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f", textDecorationLine: "underline" }}>{prescriptionDetails.patient.age}</Text>
								</View>
								<View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
									<Text style={{ fontSize: 14, color: "#2b2b2b", fontWeight: "bold" }}>Sex:</Text>
									<Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f", textDecorationLine: "underline" }}>{prescriptionDetails.patient.gender}</Text>
								</View>
							</View>

							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<View style={{ width: "100%", marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 10 }}>
									<View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
										<Text style={{ fontSize: 14, color: "#2b2b2b", fontWeight: "bold" }}>Dentist:</Text>
										<Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f", textDecorationLine: "underline" }}>Dr. {dentist}</Text>
									</View>
									<View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
										<Text style={{ fontSize: 14, color: "#2b2b2b", fontWeight: "bold" }}>Date:</Text>
										<Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f", textDecorationLine: "underline" }}>{moment(prescriptionDetails.date).format("MM-DD-YYYY")}</Text>
									</View>
								</View>
							</View>

							<View style={{ width: "100%", paddingTop: 15 }}>
								<Image
									source={require('../../assets/images/rx.png')}
									style={{ width: 60, height: 60, }}
									resizeMode="contain"
								/>
							</View>
						</View>
					</View>

					<View style={{ paddingTop: 8, alignItems: "center" }}>
						<Text style={{ fontSize: 15 }}>{prescriptionDetails?.remarks.trim()}</Text>
					</View>

					<View style={{ position: 'absolute', right: 0, bottom: 0, padding: 10 }}>
						<Text style={{ textDecorationLine: 'underline', fontSize: 10 }}>Dr. {prescriptionDetails.dentist.fullname}</Text>
						<Text style={{ textAlign: 'right', fontSize: 10 }}>License #: <Text style={{ textDecorationLine: 'underline' }}>57558</Text></Text>
						<Text style={{ textAlign: 'right', fontSize: 10 }}>PTR #: <Text style={{ textDecorationLine: 'underline' }}>4835266</Text></Text>
					</View>
				</View>

			</ScrollView>
		</SafeAreaView>
	);
}

export default React.memo(Prescription);