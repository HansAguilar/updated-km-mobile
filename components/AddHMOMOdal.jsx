import React, { Component, useState } from 'react';
import { TouchableHighlight, Text, StyleSheet, View, Dimensions, TextInput, ScrollView } from 'react-native';
import ToastFunction from '../config/toastConfig';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useDispatch } from 'react-redux';
import { createInsurance } from '../redux/action/InsuranceAction';

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
            <ScrollView style={{ width: "100%", height: "auto", maxHeight: 300, backgroundColor: "white", padding: 20, borderRadius: 10, zIndex: -10, paddingBottomBottom: 20 }}>
                <Text style={{ fontSize: 18, borderBottomWidth: 1, marginBottom: 10 }}>Add Card</Text>

                {/* CARD NAME */}
                <View>
                    <Text>Card Name</Text>
                    <Text
                        style={{ backgroundColor: "#f3f4f6", width: "100%", paddingHorizontal: 10, paddingVertical: 8 }}
                        onPress={() => setCardInfo({ ...cardInfo, isCardActive: true })}
                    >
                        {cardInfo.card ? cardInfo.card : "Select card name..."}
                    </Text>
                    {
                        cardInfo.isCardActive && (
                            <ScrollView style={{ width: "100%", height: 200, backgroundColor: "#fafafa", paddingVertical: 5, paddingHorizontal: 10, paddingBottom: 20 }}>
                                {
                                    availableHMOList.map((val, idx) => (
                                        <Text key={idx} onPress={() => setCardInfo({ ...cardInfo, card: val, isCardActive: false })} style={{ borderBottomWidth: 1, paddingVertical: 10 }}>{val}</Text>
                                    ))
                                }
                            </ScrollView>
                        )
                    }
                </View>

                {
                    cardInfo.card && !cardInfo.isCardActive && (
                        <View style={{ marginTop: 10 }}>

                            {/* CARD NUMBER */}
                            <View>
                                <Text>Card number</Text>
                                <TextInput
                                    name="cardNumber"
                                    value={cardInfo.cardNumber}
                                    style={{ backgroundColor: "#f3f4f6", paddingVertical: 5, paddingHorizontal: 10, marginBottom: 10 }}
                                    placeholder='ex. 1234 4567 789'
                                    onChangeText={(text) => handleChange("cardNumber", text)}
                                />
                            </View>

                            {/* COMPANY */}
                            <View>
                                <Text>Company (Type N/A if none)</Text>
                                <TextInput
                                    name="company"
                                    value={cardInfo.company}
                                    style={{ backgroundColor: "#f3f4f6", paddingVertical: 5, paddingHorizontal: 10 }}
                                    placeholder='ex. STI Caloocan'
                                    onChangeText={(text) => handleChange("company", text)}
                                />
                            </View>

                        </View>
                    )
                }

                <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', width: "100%", justifyContent: 'space-between', columnGap: 10, marginBottom: 40 }}>
                    <Text
                        style={{ backgroundColor: "#ef4444", color: "white", flex: 1, paddingVertical: 5, textAlign: 'center', borderRadius: 10 }}
                        onPress={cancelButton}
                    >Cancel</Text>
                    <Text
                        style={{ backgroundColor: "#10b981", color: "white", flex: 1, paddingVertical: 5, textAlign: 'center', borderRadius: 10 }}
                        onPress={submitButton}
                    >Submit</Text>
                </View>
            </ScrollView>
            <Toast />
        </View>
    )
}
