import { View, Pressable, Text, ScrollView, TouchableHighlight, Dimensions, Image, Alert } from 'react-native';
import { styles } from '../../style/styles';
import Title from '../../components/Title';
import { useDispatch, useSelector } from 'react-redux';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import React from 'react';
import moment from 'moment';

const History = ({ navigation }) => {
    const dispatch = useDispatch();
    const { height } = Dimensions.get("screen");
    const patient = useSelector((state) => { return state.patient });
    const appointment = useSelector((state) => { return state.appointment.appointment.filter(val => val.patient.patientId === patient.patient.patientId && (val.status === "DONE" || val.status === "CANCELLED")) });

    return (
        <>
            <View style={{ ...styles.containerGray, position: 'relative' }}>
                <Title title={"History"} />
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>

                {
                    appointment.length <= 0 ?
                        <View style={{ alignItems: "center", gap: 15 }}>
                            <Text style={{ fontSize: 16, fontWeight: "500", color: "#3f3f3f" }}>You have no appointment history</Text>
                            <Text style={{ fontSize: 16, fontWeight: "500", color: "#3f3f3f" }}>Make an appointment now</Text>
                            <SimpleLineIcons name='question' size={200} />
                        </View>
                        :
                        (
                            <ScrollView style={{ width: "100%", height: 100, paddingHorizontal: 20, marginTop: 5 }}>
                                {
                                    appointment.map((val, idx) => (
                                        <View key={idx} style={{ backgroundColor: "white" }}>
                                            <Text style={{ backgroundColor: val.status === "DONE" ? "#10b981" : "#ef4444", paddingHorizontal: 10, paddingVertical: 6, color: "#fff" }}>{val.status}</Text>
                                            <View style={{ padding: 10 }}>
                                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{moment(val.appointmentDate).format("MMM DD, YYYY")}</Text>
                                                <Text style={{ fontSize: 16 }}>{val.status === "DONE" ? `Appointment was successful` : `${val.reasonOfCancellation}`}</Text>
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