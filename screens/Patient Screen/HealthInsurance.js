import { View, Pressable, Text, ScrollView, TouchableHighlight, Dimensions, Image, Alert, Button } from 'react-native';
import { styles } from '../../style/styles';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import AddModal from "../../components/AddHMOMOdal";
import UpdateModal from "../../components/UpdateHMOModal";
import { deleteInsurance } from '../../redux/action/InsuranceAction';

const HealthInsurance = ({ }) => {
    const { height } = Dimensions.get("screen");
    const dispatch = useDispatch();
    const insurance = useSelector((state) => state.insurance.insurance);
    const { patientId } = useSelector((state) => state.patient.patient)
    const [addHMOModal, setHMOModal] = useState(false);
    const [updateHMOModal, setUpdateHMOModal] = useState({
        info: null,
        isShow: false
    });

    return (
        <>
            {addHMOModal && <AddModal patientId={patientId} setModal={setHMOModal} />}
            {updateHMOModal.isShow && <UpdateModal modal={updateHMOModal} setModal={setUpdateHMOModal} />}
            <ScrollView style={{ ...styles.containerGray, position: 'relative', padding: 10, height: "100%", marginBottom: 20 }}>


                {
                    insurance.map((val, idx) => (
                        <View key={idx} style={{ width: "100%", backgroundColor: "white", padding: 10, borderRadius: 10, marginBottom: 10 }}>
                            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{val.card}</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', columnGap: 5 }}>
                                    <Text
                                        style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: "#38bdf8", color: "white" }}
                                        onPress={() => { setUpdateHMOModal({ ...updateHMOModal, info: val, isShow: true }) }}
                                    >Update</Text>
                                    <Text style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: "#ef4444", color: "white" }} onPress={() => dispatch(deleteInsurance(val.insuranceId))}>Delete</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 12, }}>Card Number: {val.cardNumber}</Text>
                            <Text style={{ fontSize: 12 }}>Company Name: {val.company}</Text>
                        </View>
                    ))
                }
            </ScrollView>
            <View style={{ padding: 20 }}>
                <Text style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#34d399", textAlign: 'center', color: "white", marginBottom: 10, borderRadius: 10 }}
                    onPress={() => setHMOModal(true)}
                >Add Card</Text>
            </View>

        </>
    );
}

export default React.memo(HealthInsurance);