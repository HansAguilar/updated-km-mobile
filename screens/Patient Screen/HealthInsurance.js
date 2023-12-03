import { View, Pressable, Text, ScrollView, TouchableHighlight, Dimensions, } from 'react-native';
import { styles } from '../../style/styles';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import AddModal from "../../components/AddHMOMOdal";
import UpdateModal from "../../components/UpdateHMOModal";
import { deleteInsurance, fetchInsurance } from '../../redux/action/InsuranceAction';
import AntDesign from "react-native-vector-icons/AntDesign";

const HealthInsurance = ({ }) => {
    const { height } = Dimensions.get("screen");
    const dispatch = useDispatch();
    const insurance = useSelector((state) => state?.insurance?.insurance);
    const { patientId } = useSelector((state) => state.patient.patient)
    const [addHMOModal, setHMOModal] = useState(false);
    const [updateHMOModal, setUpdateHMOModal] = useState({
        info: null,
        isShow: false
    });

    useEffect(()=>{
        dispatch(fetchInsurance(patientId));
    },[])
    return (
        <>
            {addHMOModal && <AddModal patientId={patientId} setModal={setHMOModal} />}
            {updateHMOModal.isShow && <UpdateModal modal={updateHMOModal} setModal={setUpdateHMOModal} />}

            <ScrollView style={{ ...styles.containerGray, position: 'relative', padding: 10, height: "100%", marginBottom: 20 }}>

                {
                    insurance?.map((val, idx) => (
                        <Pressable key={idx} style={{ width: "100%", backgroundColor: "white", padding: 10, borderRadius: 4, marginBottom: 10, elevation: 1.2 }} onPress={() => { setUpdateHMOModal({ ...updateHMOModal, info: val, isShow: true }) }}>
                            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                <Text style={{ fontSize: 16, fontWeight: "500", color: "#06a9c6", textDecorationLine: "underline" }}>{val.card}</Text>
                                <AntDesign name='delete' size={15} style={{ backgroundColor: "#f2f2f2", borderRadius: 50, padding: 6, color: "#595959" }} onPress={() => dispatch(deleteInsurance(val.insuranceId))} />
                            </View>

                            <View style={{ paddingVertical: 6 }}>
                                <Text style={{ fontSize: 14, color: "#595959" }}>Card Number: {val.cardNumber}</Text>
                                <Text style={{ fontSize: 14, color: "#595959" }}>Company Name: {val.company}</Text>
                            </View>
                        </Pressable>
                    ))
                }

            </ScrollView>

            <View style={{ padding: 20 }}>
                <Text style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#06a9c6", textAlign: 'center', color: "#fff", marginBottom: 10, borderRadius: 6 }} onPress={() => setHMOModal(true)}>
                    Add Card
                </Text>
            </View>

        </>
    );
}

export default React.memo(HealthInsurance);