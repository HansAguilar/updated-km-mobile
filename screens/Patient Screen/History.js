import {View, Pressable, Text, ScrollView,TouchableHighlight,Dimensions,Image,Alert} from 'react-native';
import { styles } from '../../style/styles';
import Title from '../../components/Title';
import { useDispatch, useSelector } from 'react-redux';

import React,{ useEffect, useState } from 'react';
import { createPayment } from '../../redux/action/PaymentAction';
import moment from 'moment';

const History = ({navigation}) =>{
    const dispatch = useDispatch();
    const { height } = Dimensions.get("screen");
    const patient = useSelector((state)=>{return state.patient});
    const appointment = useSelector((state)=>{ return state.appointment.appointment.filter(val=>val.patient.patientId===patient.patient.patientId && (val.status==="DONE"||val.status==="CANCELLED")) });


    console.log(appointment.length);
    return  (
       <>
         <View style={{...styles.containerGray,position:'relative'}}>
            <Title title={"History"} />
                {
                    appointment && (
                        <ScrollView style={{width:"100%",height:100, paddingHorizontal:20,marginTop:5 }}>
                            {
                                appointment.map((val,idx)=>(
                                    <View key={idx} style={{backgroundColor:"white"}}>
                                        <Text style={{backgroundColor:val.status==="DONE"?"#10b981":"#ef4444", paddingHorizontal:10, paddingVertical:6, color:"#fff"}}>{val.status}</Text>
                                        <View style={{padding:10}}>
                                            <Text style={{fontSize:12,fontWeight:'bold'}}>{moment(val.appointmentDate).format("MMM DD, YYYY")}</Text>
                                            <Text style={{fontSize:16}}>{val.status==="DONE" ? `Appointment was successful` :  `Appointment has been cancelled`}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </ScrollView>
                    )
                }
        </View>
       </>
    );
}

export default React.memo(History);