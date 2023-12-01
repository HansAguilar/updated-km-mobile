import React from 'react';
import { View, Text, Image,Dimensions,Pressable } from 'react-native';
import { styles } from "../../style/styles";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { dentistFetchPayment, } from '../../redux/action/PaymentAction';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { useRef } from 'react';

function History({route}) {
    const { height, width } = Dimensions.get("screen");
    const dispatch = useDispatch();
    const { patientId } = route.params;
    const payment  = useSelector((state)=>state.payment?.payment);
    const [loading, setLoading] = useState(true);
    


    useEffect(()=>{
      dispatch(dentistFetchPayment(patientId, setLoading));
    },[patientId]);

    
    return  (
      <ScrollView style={{...styles.containerGray,maxHeight:height, width:width,position:'relative',padding:20,marginBottom:40}}>
          { loading && <Text>Loading</Text>}
          {
            !loading && payment && (
              payment.map((val,idx)=>(
                <View key={idx} style={{ width:"100%", backgroundColor:"white", marginBottom:10, paddingHorizontal:15, paddingVertical:10 }}>
                    {/* Appointment Date */}
                    <Text>{moment(val.appointment.appointmentDate).format("MMM DD, YYYY")}</Text>

                    {/* Time Start */}
                    <Text>Time start: {moment(val.appointment.timeStart, 'HH:mm:ss').format('h:mm A')}</Text>

                    {/* Time End */}
                    <Text>Time start: {moment(val.appointment.timeEnd, 'HH:mm:ss').format('h:mm A')}</Text>

                    {/* SERVICES */}
                    <Text>Services</Text>
                    <View style={{display:'flex', flexDirection:'row',columnGap:10,}}>
                      {
                        val.appointment.dentalServices.map((v, idx)=>(
                          <Text key={idx}>{v.name}</Text>
                        ))
                      }
                    </View>
                    
                    {/* Amount Charge */}
                    <Text>Amount Charge: Php. {val.amountCharge.toLocaleString()}</Text>

                    {/* Amount Charge */}
                    <Text>Amount Charge: Php. {val.balance.toLocaleString()}</Text>

                    {/* Amount Charge */}
                    <Text>Status: {val.appointment.status }</Text>
  
                </View>
              ))
            )
          }
      </ScrollView>
    )
}

export default History