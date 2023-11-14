import React from 'react';
import { View, Text, Image,Dimensions,Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from "../../style/styles";
import EntypoIcon from 'react-native-vector-icons/Entypo';
import DentistCard from '../../components/DentistCard';
import Modal from '../../components/TreatmentModal';
import moment from 'moment';
import { useState } from 'react';

function Home({navigation,setSideNavShow,setAppointmentId}) {
    const { activeDentist } = useSelector((state)=>{ return state.dentist; });
    const appointment = useSelector((state)=>{ return state.appointment.appointment; });
    const { width, height } = Dimensions.get("screen");
    const [modal, setModal] = useState(false);
    const [treatmentData, setTreatmentData] = useState(null);


    const currentPatient = appointment.filter((val)=>val.status==="PROCESSING"||val.status==="TREATMENT_PROCESSING");
    // THIS IS THE CORRECT
    // const currentPatient = appointment.filter((val)=>val.status==="PROCESSING"&&val.status==="TREATMENT_PROCESSING" && moment(val.appointmentDate,"YYYY-MM-DD").isSame(moment(), 'day'));

    return activeDentist && (
      <View style={{...styles.containerGray,height:height, width:width,position:'relative'}}>
        {modal && (<Modal setModal={setModal} treatmentData={treatmentData} />)}
        <View style={{ width:width, height:height/3, backgroundColor:"#06b6d4", ...styles.shadow, padding:15 }} >
            <Pressable onPress={()=>setSideNavShow(true)}>
                <EntypoIcon name='menu' size={25} color={'#fff'} />
            </Pressable>
            <View style={{width:"100%", display:'flex', justifyContent:'center',alignItems:'center',paddingTop:30,rowGap:10}}>
                <Image source={{uri:activeDentist.profile}} style={{width:115, height:115, borderRadius:100}} alt='Dentist Profile'/>
                <View style={{display:'flex', justifyContent:'center', alignItems:"center"}}>
                   <Text style={{ color:"#fff", fontWeight:"bold", fontSize:18 }}>Dr. {activeDentist.fullname}</Text>
                   <Text style={{ color:"#fff", fontSize:12 }}>Dentist</Text>
                </View>
            </View>
        </View>


        <DentistCard header="Current Patient" data={currentPatient} setModal={setModal} setTreatmentData={setTreatmentData} setAppointmentId={setAppointmentId} navigation={navigation}/>
       
      </View>
    )
}

export default Home