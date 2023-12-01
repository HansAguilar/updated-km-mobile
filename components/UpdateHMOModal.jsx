import React, { Component, useState } from 'react';
import { TouchableHighlight, Text, StyleSheet, View, Dimensions, TextInput, ScrollView } from 'react-native';
import ToastFunction from '../config/toastConfig';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useDispatch } from 'react-redux';
import { updateInsurance } from '../redux/action/InsuranceAction';

export default function HMOModal({ modal, setModal }) {
    const dispatch = useDispatch();
    const { width } = Dimensions.get("screen");
    const { info } = modal;
    const [cardInfo, setCardInfo] = useState({
        card: info.card,
        isCardActive: false,
        cardNumber: info.cardNumber,
        company: info.company,
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
        dispatch(updateInsurance(info.insuranceId, cardInfo));
        setModal(false)
    }

    return (
        <View style={{ height: "100%", width: width, backgroundColor: "rgba(0, 0, 0, 0.5)", position: 'absolute', zIndex: 10, padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: "100%", height: "50%", backgroundColor: "white", borderRadius: 6, elevation: 1 }}>
                <ScrollView style={{ width: "100%", height: "100%", padding: 20, borderRadius: 10, zIndex: -10, paddingBottomBottom: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 6 }}>Update HMO Card</Text>

                    {/* CARD NAME */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: "#595959" }}>Card Name</Text>
                        <Text style={{ backgroundColor: "#f3f4f6", width: "100%", paddingHorizontal: 10, paddingVertical: 8 }} onPress={() => setCardInfo({ ...cardInfo, isCardActive: !cardInfo.isCardActive })}>
                            {cardInfo.card ? cardInfo.card : "Select card name..."}
                        </Text>
                        {
                            cardInfo.isCardActive && (
                                <ScrollView style={{ width: "100%", height: "100%", backgroundColor: "#fafafa", paddingVertical: 5, paddingHorizontal: 10, }}>
                                    {
                                        availableHMOList.map((val, idx) => (
                                            <Text key={idx} onPress={() => setCardInfo({ ...cardInfo, card: val, isCardActive: false })} style={{ paddingHorizontal: 8, color: "#3f3f3f", borderBottomColor: "#ccc", borderBottomWidth: 1, paddingVertical: 10 }}>{val}</Text>
                                        ))
                                    }
                                </ScrollView>
                            )
                        }
                    </View>

                    {
                        cardInfo.card && !cardInfo.isCardActive && (
                            <View style={{ marginVertical: 10, marginBottom: 40 }}>
                                {/* CARD NUMBER */}
                                <View>
                                    <Text style={{ fontSize: 14, color: "#595959" }}>Card number</Text>
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
                                    <Text style={{ fontSize: 14, color: "#595959" }}>Company (Type N/A if none)</Text>
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

                </ScrollView>

                <View style={{ width: "100%", display: 'flex', flexDirection: 'row', gap: 10, padding: 20 }}>
                    <Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#ef4444", color: "#fff", borderRadius: 6 }} onPress={cancelButton}>Cancel</Text>
                    <Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#06b6d4", color: "#fff", borderRadius: 6 }} onPress={submitButton}>Save Changes</Text>
                </View>
                <Toast />
            </View>
        </View>
    )
}
