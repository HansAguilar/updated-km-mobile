import React,{ useEffect, useState } from 'react';
import {View, Pressable, Text} from 'react-native';
import { styles } from '../../style/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import Appointment from './Appointment/index';
import axios from 'axios';
import { PATIENT_URL, SOCKET_LINK } from '../../config/APIRoutes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IonicsIcon from 'react-native-vector-icons/Ionicons';
import Settings from './Settings';
import AppointmentDetails from './AppointmentDetails';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatient } from '../../redux/action/PatientAction';
import Loader from '../../components/Loader';
import { fetchAppointment,fetchChanges,adminChanges } from '../../redux/action/AppointmentAction';
import { fetchAppointmentFee } from '../../redux/action/AppointmentFeeAction';
import { fetchPatientMessage } from '../../redux/action/MessageAction';
import { fetchPayment,fetchAdminPayment,adminUpdatePayment } from '../../redux/action/PaymentAction';
import { fetchInstallmentByPatient } from '../../redux/action/InstallmentAction';
import { fetchSchedule } from '../../redux/action/ScheduleAction';
import { fetchPrescription } from '../../redux/action/PrescriptionAction';
import { fetchResponseMessage } from "../../redux/action/MessageAction";
import Payment from './Payment';
import Drawer from '../../components/CustomDrawer';
import Message from './Message/index';
import History from './History';
import ViewDetails from './ViewDetails';
import Prescription from './Prescription';
import PrescriptionDetails from './PrescriptionDetails';
import UpdateAppointment from './UpdateAppointment';
import * as io from "socket.io-client";
import { log } from 'react-native-reanimated';

const socket = io.connect(SOCKET_LINK);
const navLinks = [
  {
    icon: "home-outline",
    link: 'Dashboard'
  },
  {
    icon: "message1",
    link: 'Message'
  },
  {
    icon: "calendar-outline",
    link: 'Appointment'
  },
  // {
  //   icon: "person",
  //   link: 'Settings'
  // },

]
const Main = React.memo(({navigation})=> {
  const dispatch = useDispatch();
  const Stack = createNativeStackNavigator();
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);

  const [isSideNavShow, setSideNavShow]= useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const patient = useSelector((state)=>{return state.patient});
  const appointment = useSelector((state)=>{return state.appointment});
  const messages = useSelector((state)=>{return state.messages});
  
  const fetchPatientData = async () => {
    const token = await AsyncStorage.getItem('token');
    dispatch(fetchPatient(token));
  };
  
  const fetchAppointmentData = async() => {
    if (patient && patient.patient && patient.patient.patientId) {
      await dispatch(fetchAppointment(patient.patient.patientId));
      await dispatch(fetchPatientMessage(patient.patient.patientId));
      await dispatch(fetchPayment(patient.patient.patientId));
      await dispatch(fetchInstallmentByPatient(patient.patient.patientId));
      await dispatch(fetchPrescription(patient.patient.patientId))
      await dispatch(fetchSchedule());
      await dispatch(fetchAppointmentFee());
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);
  
  useEffect(() => {
    fetchAppointmentData();
  }, [patient]);

  useEffect(()=>{
    socket.on("response_changes",(data)=>{
      dispatch(adminChanges(data.value));
      dispatch(fetchAdminPayment(patient?.patient?.patientId));
    })
    socket.on("response_admin_changes",(data)=>{
      dispatch(adminChanges(data.value));
      dispatch(fetchAdminPayment(patient?.patient?.patientId));
    })

    socket.on("admin_response_payment_changes",(data)=>{
      dispatch(adminUpdatePayment(data.value));
    })

    // socket.on("received_by_patient",(data)=>{
    //    console.log(data.value.receiverId.patientId);
    //   dispatch(fetchResponseMessage(patient?.patient?.patientId))
    //   // if(patient?.patient?.patientId===data.value.receiverId.patientId){
    //   //   dispatch(fetchResponseMessage(data.key, data.value))
    //   // }
    // })
    return ()=>{
      socket.off();
    }
  },[socket]);



  const navigateToLink = (link) => navigation.navigate(`${link}`);
    return (
      <>
        {patient.loading || appointment.loading || messages.loading  && (<Loader loading={appointment.loading} />)}
        {
          (!patient.loading && !appointment.loading && !messages.loading) && (
            <>
               <Drawer navigation={navigateToLink} isSideNavShow={isSideNavShow} setSideNavShow={setSideNavShow} />
               <Stack.Navigator initialRouteName='Dashboard'>
                <Stack.Screen name='Dashboard' options={{headerShown: false }}>
                    {props=><Home setAppointmentId={setAppointmentId} setSideNavShow={setSideNavShow} {...props}/> }
                </Stack.Screen>
                <Stack.Screen name='Message' options={{headerShown: false }}>
                    {props=><Message  {...props}/>}
                </Stack.Screen>
                <Stack.Screen name='Appointment' options={{headerShown: false }}>
                    {props=><Appointment dispatch={dispatch}  {...props}/>}
                </Stack.Screen>
                <Stack.Screen name='Payment' options={{headerShown: false }}>
                    {props=><Payment {  ...props}/>}
                </Stack.Screen>
                <Stack.Screen name='Summary' options={{headerTitle:"Appointment Details" }}>
                    {props=><AppointmentDetails appointmentId={appointmentId} setAppointmentId={setAppointmentId} {...props}/>}
                </Stack.Screen>
                <Stack.Screen name='ViewDetails'>
                    {props=><ViewDetails {  ...props}/>}
                </Stack.Screen>
                <Stack.Screen name='History' options={{headerShown: false }}>
                    {props=><History {  ...props}/>}
                </Stack.Screen>
                <Stack.Screen name='Prescription' options={{headerShown: false }}>
                    {props=><Prescription setPrescriptionDetails={setPrescriptionDetails} {  ...props}/>}
                </Stack.Screen>
                <Stack.Screen name='Prescription Details' >
                    {props=><PrescriptionDetails prescriptionDetails={prescriptionDetails} {  ...props}/>}
                </Stack.Screen>
                <Stack.Screen name='Update Schedule' >
                    {props=><UpdateAppointment {  ...props}/>}
                </Stack.Screen>
        
            </Stack.Navigator>
            
                <View style={{width:'100%', height:60, position:'relative', bottom:0, paddingVertical:10, paddingHorizontal:30, backgroundColor:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center' , flexDirection:'row', ...styles.shadow }}>
                  {
                  navLinks.map((val, idx)=>(
                    <Pressable style={{width:'auto',display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center'}} key={idx} onPress={()=>navigateToLink(val.link)}>
                          {
                            val.icon === "message1" ? <AntDesign  name={val.icon} size={20} color={'#71717a'}/>
                            :<IonicsIcon name={val.icon} size={20} color={'#71717a'}/>
                          }
                          <Text style={{fontSize:10, color:'#71717a',fontWeight:'bold'}}>{val.link}</Text>
                    </Pressable>
                  ))
                  }
                </View>
               </> 
          )
        }
      </>
    )
})


export default Main