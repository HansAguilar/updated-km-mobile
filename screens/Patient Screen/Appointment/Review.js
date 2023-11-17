import React, { useState } from 'react';
import { ScrollView, View, Text,Image, Dimensions,TouchableHighlight }from 'react-native';
import { styles } from '../../../style/styles';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { createAppointment } from '../../../redux/action/AppointmentAction';
import { createNotification } from '../../../redux/action/NotificationAction';
import ToastFunction from '../../../config/toastConfig';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useEffect } from 'react';
import * as io from "socket.io-client";
import { SOCKET_LINK } from '../../../config/APIRoutes';

const socket = io.connect(SOCKET_LINK);
function Review({navigation, appointmentDetails}) {
  const {height} = Dimensions.get("screen");
  const dispatch = useDispatch();
  const [isAvailable, setModal] = useState(false);
  const {dentists} = useSelector((state)=>{return state.dentist});
  const {services} = useSelector((state)=>{return state.services});
  const { appointment, error} = useSelector((state)=>{return state.appointment});
  const { patient} = useSelector((state)=>{return state.patient});

  const dentist = dentists.filter(val=>{return val.dentistId === appointmentDetails.dentist});
  const selectedServices = services.filter(val=>{ return appointmentDetails.dentalServices.includes(val.serviceId);});

  const rules = [
    {
      title: "Appointment Scheduling",
      description:"Patients are required to schedule their appointments with our dental clinic in advance. Appointments can be scheduled over the phone, through our website or in person. We recommend that you schedule your appointment as soon as possible to ensure availability."
    },
    {
      title: "Cancellation Policy",
      description:"We understand that unforeseen circumstances may arise that could force you to cancel your appointment. However, we kindly ask that you give us at least 24 hours notice if you need to cancel or reschedule your appointment. Failure to provide sufficient notice may result in a cancellation fee or the loss of your deposit."
    },
    {
      title: "Late Arrivals",
      description:"We ask that patients arrive on time for their appointments. If you are running late, please notify us as soon as possible. If you arrive late for your appointment, we may not be able to see you and you may need to reschedule for a later time."
    },
    {
      title: "Payment Policy",
      description:"Payment is due at the time of your appointment. We accept cash, e-payment and insurance payments. If you have dental insurance, we will need to verify your coverage before your appointment."
    },
    {
      title: "Insurance",
      description:"We accept most major dental insurance plans. Please bring your insurance card with you to your appointment. If your insurance requires a co-pay or deductible, it will be due at the time of your appointment."
    },
    {
      title: "Treatment Plans",
      description:"Our dentists will create a personalized treatment plan for each patient based on their individual needs. We will provide a detailed explanation of the treatment plan, including the estimated cost and duration of treatment. If you have any questions or concerns, please do not hesitate to ask."
    },
    {
      title: "Consent Forms",
      description:"Before any treatment is performed, patients will be required to sign consent forms. These forms will provide information about the treatment, the risks and benefits, and any alternatives that may be available."
    },
    {
      title: "Privacy Policy",
      description:"Our dental clinic takes patient privacy very seriously. We will not share your personal information with any third parties without your consent."
    },
    {
      title: "Emergencies",
      description:"If you experience a dental emergency outside of our regular office hours, please call our emergency number for assistance."
    },
    {
      title: "Agreement",
      description:"By scheduling an appointment with our dental clinic, you agree to these terms and conditions."
    },
  ]

  const submitButton = async () => {
    const data = {
      name: "Appointment Set",
      time: moment().format("HH:mm:ss"),
      date: moment().format("YYYY-MM-DD"),
      patientId: patient.patientId,
      description: `
      ${patient.firstname} ${patient.lastname} request an appointment
      ${moment(appointmentDetails.date).format("L").toString()===moment().format("L").toString() ? "today": "on"} 
      ${moment(appointmentDetails.date).format("MMM DD YYYY")}`,
      receiverType: "ADMIN"
    }
    await dispatch(createAppointment(appointmentDetails, navigation, ToastFunction,setModal));
    await dispatch(createNotification(data));
  };

  const Modal = () =>{
    return isAvailable&&(
      <View style={{ width: '100%', height: height, backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 500, padding:20}}>
        <View style={{width:'100%', height:550, backgroundColor:'#06b6d4',padding:10, ...styles.shadow}}>
            <View style={{width:'100%',display:'flex', flexDirection:"row", alignItems:'center', columnGap:10,borderBottomColor:"#fff",borderBottomWidth:1,paddingBottom:10}}>
              <Image source={require("../../../assets/images/small-logo.jpg")} style={{width:65, height:65,borderRadius:50}} />
              <View>
                <Text style={{textTransform:'uppercase',fontWeight:'bold', color:"#fff",letterSpacing:2}}>Terms and condition</Text>
                <Text style={{color:"#fff", fontSize:10}}>Last Update Jan 2023</Text>
              </View>
            </View>

            <ScrollView style={{maxHeight:400,marginTop:5}}>
              {
                rules.map((val,idx)=>(
                  <View style={{width:'100%',paddingHorizontal:10, marginTop:10}} key={idx}>
                    <Text style={{fontSize:18, fontWeight:'bold',color:'#fff'}}>{idx+1}.{val.title}</Text>
                    <Text style={{fontSize:12, color:"#fff", textAlign:'justify',marginTop:5}}>{val.description}</Text>
                  </View>
                ))
              }
            </ScrollView>
            
            <View style={{ padding:10, display:'flex', flexDirection:'row', justifyContent:'space-between', ...styles.shadow }}>
              <TouchableHighlight style={{ width:120, paddingHorizontal:15, paddingVertical:8, borderWidth:1, borderColor:'#fff',borderRadius:20}} onPress={()=>setModal(false)}>
                <Text style={{textAlign:'center', textTransform:'uppercase', fontSize:12,color:"#fff"}}>Decline</Text>
              </TouchableHighlight>
              <TouchableHighlight style={{paddingHorizontal:15, paddingVertical:8, backgroundColor:'#fff',borderRadius:20, }} onPress={submitButton}>
                <Text style={{width:100, textAlign:'center', textTransform:'uppercase', fontSize:12, color:"#155e75"}}>accept</Text>
              </TouchableHighlight>
            </View>

        </View>
      </View>
    )
  }
  return (
    <>
      <Toast />
      <Modal/>
    <ScrollView style={{...styles.containerGray, padding:15, position:'relative', zIndex:-500}}>
      
        <Text style={{fontSize:22, fontWeight:'bold'}}>Summary</Text>

        {/* DENTIST INFORMATION */}
        <View style={{marginTop:10, backgroundColor:'#fff', padding:15, borderRadius:10, ...styles.shadow}}>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', columnGap:10, borderBottomColor:'#a1a1aa', borderBottomWidth:1, paddingBottom:8}}>
                <Image source={{uri:dentist[0].profile}} style={{width:55,height:55,borderRadius:50}}/>
                <View>
                    <Text style={{fontSize:16, color:'#525252', fontWeight:'bold'}}>Dr. {dentist[0].fullname}</Text>
                    <Text style={{fontSize:10, }}>Dentist</Text>
                    {/* <Text style={{fontSize:12}}>{moment(appointmentDetails.date).format("LL")}</Text> */}
                </View>
            </View>
            <Text style={{marginTop:10, fontSize:11,}}>Date & Time</Text>
            <Text style={{width:'100%', fontSize:13, fontWeight:'bold'}}>{moment(appointmentDetails.date).format("dddd, MMMM Do YYYY")} <View style={{width:5, height:5, backgroundColor:'#525252', borderRadius:50, marginVertical:10}}></View>{moment(appointmentDetails.timeStart, 'HH:mm:ss').format('h:mm A')}</Text>
        </View>

        {/* SERVICES*/}
        <Text style={{marginTop:10,marginBottom:5, textTransform:'capitalize'}}>{appointmentDetails.dentalServices.length} selected services</Text>
        <View style={{ backgroundColor:'#06b6d4', padding:15, borderRadius:10, ...styles.shadow,display:'flex', flexDirection:'column',rowGap:10}}>
            {
              selectedServices.map((val,idx)=>(
                <View key={idx} style={{borderBottomWidth:idx+1===appointmentDetails.dentalServices.length?0:1, borderBottomColor:'#0891b2',paddingBottom:10}}>
                  <Text style={{fontWeight:'bold', fontSize:16,color:"#fff"}}>{val.name} <Text style={{color:"#fff",fontSize:11}}>( {val.duration ==="01:00:00" ? "1hr":"30 min"
                    } )</Text></Text>
                  <View style={{display:'flex', flexDirection:'row',alignItems:'center',justifyContent:'space-between',  }}>
                    <Text style={{textTransform:'capitalize', fontSize:11,color:"#fff"}}>{val.type} </Text>
                    {/* <Text style={{fontSize:10,color:"#fff"}}>₱ {val.price.toLocaleString()}</Text> */}
                  </View>
                </View>
              ))
            }
        </View>

        {/* Payment*/}
        <Text style={{marginTop:10,marginBottom:5, textTransform:'capitalize'}}>Payment Information</Text>
        <View style={{ backgroundColor:'#fff', padding:15, borderRadius:10, ...styles.shadow,display:'flex', flexDirection:'column',rowGap:5}}>
            <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', }}>
              <Text style={{fontSize:10, fontWeight:'bold',color:"#52525b"}}>Total Amount</Text>
              <Text style={{fontSize:12}}>₱ {appointmentDetails.totalAmount.toLocaleString()}</Text>
            </View>
            <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between',}}>
              <Text style={{fontSize:10, textTransform:'capitalize', fontWeight:'bold',color:"#52525b"}}>Payment Type</Text>
              <Text style={{fontSize:12, textTransform:'capitalize'}}>{appointmentDetails.type}</Text>
            </View>
            <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between',}}>
              <Text style={{fontSize:10, textTransform:'capitalize', fontWeight:'bold',color:"#52525b"}}>Payment Method</Text>
              <Text style={{fontSize:12, textTransform:'capitalize'}}>{appointmentDetails.method}</Text>
            </View>
        </View>
        <TouchableHighlight style={{marginTop:20, width:'100%', paddingVertical:10,  backgroundColor:"#06b6d4", borderRadius:20,...styles.shadow}} onPress={()=>setModal(true)}>
          <Text style={{color:"#fff", textAlign:'center', fontSize:16}}>Submit</Text>
        </TouchableHighlight>
        <View style={{height:50}}></View>
    </ScrollView>
    </>
  )
}

export default React.memo(Review);