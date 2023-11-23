import React from 'react';
import { View, Text, Image,Dimensions,Pressable } from 'react-native';
import { styles } from "../../style/styles";
import { useSelector } from 'react-redux';

function History({appointmentId}) {
    const { height, width } = Dimensions.get("screen");
    const patient = useSelector((state)=>state.appointment.appointment.fetch((v)=>v.patient.patient))
    return (
      <View style={{...styles.containerGray,height:height, width:width,position:'relative'}}>
        <Text>dwad</Text>
      </View>
    )
}

export default History