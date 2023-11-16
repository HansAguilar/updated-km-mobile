import React from 'react';
import { View, Text, Image,Dimensions,Pressable } from 'react-native';
import { styles } from "../../style/styles";

function History({appointmentId}) {
    const { height, width } = Dimensions.get("screen");
    return (
      <View style={{...styles.containerGray,height:height, width:width,position:'relative'}}>

      </View>
    )
}

export default History