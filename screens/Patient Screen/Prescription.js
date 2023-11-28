import { View, Pressable, Text, ScrollView, TouchableHighlight, Dimensions, Image, Alert } from 'react-native';
import { styles } from '../../style/styles';
import Title from '../../components/Title';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from "react-native-vector-icons/AntDesign";
import React from 'react';
import moment from 'moment';

const Prescription = ({ setPrescriptionDetails, navigation }) => {
    const dispatch = useDispatch();
    const { height } = Dimensions.get("screen");
    const prescription = useSelector((state) => { return state.prescription.prescription });
    return (
        <>
            <View style={{ ...styles.containerGray, position: 'relative' }}>
                <Title title={"Prescription"} />
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                    {
                        prescription.length <= 0 ?
                            <View style={{ alignItems: "center", gap: 15 }}>
                                <Text style={{ fontSize: 16, fontWeight: "500", color: "#3f3f3f" }}>There is no prescription</Text>
                                <AntDesign name='unknowfile1' size={200} />
                            </View>
                            : (
                                <ScrollView style={{ width: "100%", height: 100, paddingHorizontal: 20, marginTop: 20 }}>
                                    {
                                        prescription.map((val, idx) => (
                                            <Pressable
                                                style={{ width: "100%", paddingHorizontal: 15, paddingVertical: 15, backgroundColor: "#fff", borderRadius: 10 }}
                                                key={idx}
                                                onPress={() => {
                                                    setPrescriptionDetails(val);
                                                    navigation.navigate("Prescription Details");
                                                }}
                                            >
                                                <Text style={{ fontWeight: 'bold' }}>Dr.{val.dentist.fullname}</Text>
                                                <Text style={{ fontSize: 12 }}>{moment(val.date).format("MMM dddd, YYYY")}</Text>
                                            </Pressable>
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

export default React.memo(Prescription);