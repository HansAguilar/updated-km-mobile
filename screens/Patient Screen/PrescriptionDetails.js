import {View, Pressable, Text, ScrollView,TouchableHighlight,Dimensions,Image,Alert} from 'react-native';
import { styles } from '../../style/styles';
import Title from '../../components/Title';
import { useDispatch, useSelector } from 'react-redux';

import React,{ useEffect, useState } from 'react';
import { createPayment } from '../../redux/action/PaymentAction';
import moment from 'moment';

const Prescription = ({prescriptionDetails, navigation}) =>{
    const dispatch = useDispatch();
    const { height } = Dimensions.get("screen");

    const doctor = prescriptionDetails.dentist.fullname.split(" ");

    return prescriptionDetails && (
       <>
         <View style={{...styles.containerGray,position:'relative',padding:20}}>
            <View style={{width:"100%", height:"100%", backgroundColor:"#fff",padding:20,position:'relative'}}>
                    {/* IMAGE */}
                    <View style={{width:"100%"}}>
                        <Image
                            source={require('../../assets/images/rx.png')}
                            style={{width:60, height:60}}
                            resizeMode="contain"
                        />
                    </View>
                    
                    <View style={{width:"100%",marginTop:10,display:'flex', flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',borderTopWidth:1, borderBottomWidth:1, paddingVertical:10}}>
                        <Text style={{textTransform:'capitalize'}}><Text style={{fontWeight:'bold'}}>Name:</Text> {prescriptionDetails.patient.firstname} {prescriptionDetails.patient.lastname}</Text>
                        <Text style={{textTransform:'capitalize'}}><Text style={{fontWeight:'bold'}}>Age:</Text> {prescriptionDetails.patient.age}</Text>
                        <Text style={{textTransform:'capitalize'}}><Text style={{fontWeight:'bold'}}>Sex:</Text> {prescriptionDetails.patient.gender}</Text>
                        {/* <Text><Text style={{fontWeight:'bold'}}>Dentist:</Text> Dr. {doctor[2]} </Text> */}
                    </View>
                    <View style={{width:"100%",marginTop:10,display:'flex', flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',borderBottomWidth:1, paddingBottom:10}}>
                        <Text style={{textTransform:'capitalize'}}><Text style={{fontWeight:'bold'}}>Dentist:</Text> Dr. {doctor[2]} </Text>
                        <Text style={{textTransform:'capitalize'}}><Text style={{fontWeight:'bold'}}>Date:</Text> {moment(prescriptionDetails.date).format("MM-DD-YYYY")}</Text>
                    </View>
                    <Text style={{marginTop:30}}>{prescriptionDetails.remarks}</Text>
                    <View style={{position:'absolute', right:0, bottom:0, padding:10}}>
                        <Text style={{textDecorationLine:'underline',fontSize:10}}>Dra. Kristie Marren V. Geronimo, DMD</Text>
                        <Text style={{textAlign:'right',fontSize:10}}>License #: <Text style={{textDecorationLine:'underline'}}>57558</Text></Text>
                        <Text style={{textAlign:'right',fontSize:10}}>PTR #: <Text style={{textDecorationLine:'underline'}}>4835266</Text></Text>
                    </View>
                </View>
                
        </View>
       </>
    );
}

export default React.memo(Prescription);