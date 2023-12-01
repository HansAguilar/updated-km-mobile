import { View, Text, Image } from 'react-native';
import { styles } from '../../style/styles';
import React from 'react';
import moment from 'moment';
import kmlogo from "../../assets/images/kmlogo.jpg";
import Ionicons from "react-native-vector-icons/Ionicons";

const Prescription = ({ prescriptionDetails, navigation }) => {
    return prescriptionDetails && (
        <>
            <View style={{ ...styles.containerGray, position: 'relative', padding: 20 }}>
                <View style={{ width: "100%", height: "100%", backgroundColor: "#fff", padding: 20, position: 'relative', borderRadius: 2, elevation: 1.5, shadowOpacity: .2 }}>
                    <View style={{ borderBottomColor: "#CCC", borderBottomWidth: 2, paddingBottom: 10, marginBottom: 10, alignItems: "center" }}>
                        <View style={{ width: "100%" }}>
                            <Image
                                source={kmlogo}
                                style={{ width: "100%", height: 60 }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={{ fontWeight: "500", fontSize: 16, paddingVertical: 6 }}>Kristie Marren V. Geronimo, DMD</Text>
                        <View style={{ padding: 6, paddingVertical: 10, gap: 8 }}>
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
                    <View style={{ width: "100%", marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                    <View style={{ width: "100%", marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 10 }}>
                        <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
                            <Text style={{ fontSize: 14, color: "#2b2b2b", fontWeight: "bold" }}>Dentist:</Text>
                            <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f", textDecorationLine: "underline" }}>Dr. {prescriptionDetails.dentist.fullname}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
                            <Text style={{ fontSize: 14, color: "#2b2b2b", fontWeight: "bold" }}>Date:</Text>
                            <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f", textDecorationLine: "underline" }}>{moment(prescriptionDetails.date).format("MM-DD-YYYY")}</Text>
                        </View>
                    </View>
                    <View style={{ width: "100%", paddingTop: 8 }}>
                        <Image
                            source={require('../../assets/images/rx.png')}
                            style={{ width: 60, height: 60, }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 15 }}>{prescriptionDetails.remarks}</Text>
                    </View>
                    <View style={{ position: 'absolute', right: 0, bottom: 0, padding: 10 }}>
                        <Text style={{ textDecorationLine: 'underline', fontSize: 10 }}>Dr. {prescriptionDetails.dentist.fullname}</Text>
                        <Text style={{ textAlign: 'right', fontSize: 10 }}>License #: <Text style={{ textDecorationLine: 'underline' }}>57558</Text></Text>
                        <Text style={{ textAlign: 'right', fontSize: 10 }}>PTR #: <Text style={{ textDecorationLine: 'underline' }}>4835266</Text></Text>
                    </View>
                </View>
            </View >
        </>
    );
}

export default React.memo(Prescription);