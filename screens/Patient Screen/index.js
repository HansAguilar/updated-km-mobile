import React, { useEffect, useState } from 'react';
import { View, Pressable, Text } from 'react-native';
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
import { fetchAppointment, fetchChanges, adminChanges, createAppointmentByAdmin, deleteByAdmin } from '../../redux/action/AppointmentAction';
import { fetchAppointmentFee, updateAppointmentFee } from '../../redux/action/AppointmentFeeAction';
import { fetchPatientMessage, sendByAdminMessage, fetchNewPatientMessage } from '../../redux/action/MessageAction';
import { fetchPayment, fetchAdminPayment, adminUpdatePayment, adminCancelledPayment, adminDeletePayment } from '../../redux/action/PaymentAction';
import { fetchInstallmentByPatient } from '../../redux/action/InstallmentAction';
import { fetchSchedule } from '../../redux/action/ScheduleAction';
import { fetchPrescription } from '../../redux/action/PrescriptionAction';
import { fetchAllNotification, storeNotification } from '../../redux/action/NotificationAction';
import Payment from './Payment';
import Drawer from '../../components/CustomDrawer';
import Message from './Message/index';
import History from './History';
import ViewDetails from './ViewDetails';
import Prescription from './Prescription';
import PrescriptionDetails from './PrescriptionDetails';
import UpdateAppointment from './UpdateAppointment';
import NotificationRoom from './NotificationRoom';
import { io } from "socket.io-client";
import { useRef } from 'react';
import HealthInsurance from './HealthInsurance';
import { fetchInsurance } from '../../redux/action/InsuranceAction';
import { fetchAnnouncement } from '../../redux/action/AnnouncementAction';
import { fetchAdmin } from '../../redux/action/AdminAction';

const socket = io(SOCKET_LINK);
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
const Main = React.memo(({ navigation }) => {
  const dispatch = useDispatch();
  const Stack = createNativeStackNavigator();
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);

  const [isSideNavShow, setSideNavShow] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const patient = useSelector((state) => { return state.patient });
  const patientId = useSelector((state) => { return state.patient.patient });
  const appointment = useSelector((state) => { return state.appointment });
  const messages = useSelector((state) => { return state.messages });
  const patientLogin = useRef("");

  const fetchPatientData = async () => {
    const token = await AsyncStorage.getItem('token');
    dispatch(fetchPatient(token, patientLogin));
  };


  const fetchAppointmentData = () => {
    try {
        dispatch(fetchAppointment(patientLogin.current));
        dispatch(fetchPatientMessage(patientLogin.current));
        dispatch(fetchPayment(patientLogin.current));
        dispatch(fetchInstallmentByPatient(patientLogin.current));
        dispatch(fetchPrescription(patientLogin.current))
        dispatch(fetchAllNotification(patientLogin.current))
        dispatch(fetchInsurance(patientLogin.current))
        dispatch(fetchSchedule());
        dispatch(fetchAppointmentFee());
        dispatch(fetchAnnouncement());
        dispatch(fetchAdmin());
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  useEffect(() => {
    fetchAppointmentData();
  }, [patientLogin.current]);

  useEffect(() => {
    //FOR APPROVAL OF APPOINTMENT
    socket.on("response_changes", (data) => {
      const parseData = JSON.parse(data);
      dispatch(adminChanges(parseData.value));
      dispatch(fetchAdminPayment(parseData.value));
    })
    // ADMIN CREATION APPOINTMENT
    socket.on("response_admin_appointment_create", (data) => {
      dispatch(createAppointmentByAdmin(data.value));
    })
    socket.on("receive_notification_by_admin", (data) => {
      const parseData = JSON.parse(data);
      if (parseData.patientId === patientLogin.current) {
        dispatch(storeNotification(parseData.notification));
      }
    })
    // FOR CANCEL APPOINTMENT
    socket.on("response_cancel_by_admin", (data) => {
      dispatch(adminChanges(data.value));
      dispatch(adminCancelledPayment(data.value));
    })
    // FOR UPDATE APPOINTMENT
    socket.on("response_admin_changes", (data) => {
      const parseData = JSON.parse(data);
      dispatch(adminChanges(parseData.value));
      dispatch(fetchAdminPayment(parseData.value));
    })
    // DELETE APPOINTMENT
    socket.on("response_delete", (data) => {
      const parseData = JSON.parse(data);
      dispatch(deleteByAdmin(parseData.value));
      dispatch(adminDeletePayment(parseData.value));
    })

    socket.on("admin_response_payment_changes", (data) => {
      dispatch(adminUpdatePayment(data.value));
    })

    socket.on("create_received_by_patient", (data) => {
      const socketData = `${data.patient}`
      if (patientLogin.current === socketData) {
        const roomKey = `${data.key}`;
        dispatch(fetchNewPatientMessage(roomKey));
      }
    });
    socket.on("received_by_patient", (data) => {
      dispatch(sendByAdminMessage(data.key, data.value))
    });
    socket.on("response_appointment_fee", (data) => {
      const parseData = JSON.parse(data)
      dispatch(updateAppointmentFee(parseData.value));
    });
    return () => {
      socket.off();
    }
  }, [socket]);

  const navigateToLink = (link) => navigation.navigate(`${link}`);
  return (
    <>
      {patient.loading || appointment.loading || messages.loading && (<Loader loading={appointment.loading} />)}
      {
        (!patient.loading && !appointment.loading && !messages.loading) && (
          <>
            <Drawer navigation={navigateToLink} isSideNavShow={isSideNavShow} setSideNavShow={setSideNavShow} />
            <Stack.Navigator initialRouteName='Dashboard'>
              <Stack.Screen name='Dashboard' options={{ headerShown: false }}>
                {props => <Home setAppointmentId={setAppointmentId} setSideNavShow={setSideNavShow} {...props} />}
              </Stack.Screen>
              <Stack.Screen name='Message' options={{ headerShown: false }}>
                {props => <Message  {...props} />}
              </Stack.Screen>
              <Stack.Screen name='Appointment' options={{ headerShown: false }}>
                {props => <Appointment dispatch={dispatch}  {...props} />}
              </Stack.Screen>
              <Stack.Screen name='Payment' options={{ headerShown: false }}>
                {props => <Payment {...props} />}
              </Stack.Screen>
              <Stack.Screen name='Summary' options={{ headerTitle: "Appointment Details" }}>
                {props => <AppointmentDetails appointmentId={appointmentId} setAppointmentId={setAppointmentId} {...props} />}
              </Stack.Screen>
              <Stack.Screen name='ViewDetails'>
                {props => <ViewDetails {...props} />}
              </Stack.Screen>
              <Stack.Screen name='Notification'>
                {props => <NotificationRoom {...props} />}
              </Stack.Screen>
              <Stack.Screen name='History' options={{ headerShown: false }}>
                {props => <History {...props} />}
              </Stack.Screen>
              <Stack.Screen name='Prescription' options={{ headerShown: false }}>
                {props => <Prescription setPrescriptionDetails={setPrescriptionDetails} {...props} />}
              </Stack.Screen>
              <Stack.Screen name='Prescription Details' >
                {props => <PrescriptionDetails prescriptionDetails={prescriptionDetails} {...props} />}
              </Stack.Screen>
              <Stack.Screen name='Update Schedule' >
                {props => <UpdateAppointment {...props} />}
              </Stack.Screen>
              <Stack.Screen name='HMO' >
                {props => <HealthInsurance {...props} />}
              </Stack.Screen>
            </Stack.Navigator>

            <View style={{ width: '100%', height: 60, position: 'relative', bottom: 0, left: 0, paddingVertical: 10, paddingHorizontal: 30, backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', ...styles.shadow }}>
              {
                navLinks.map((val, idx) => (
                  <Pressable style={{ width: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} key={idx} onPress={() => navigateToLink(val.link)}>
                    {
                      val.icon === "message1" ? <AntDesign name={val.icon} size={20} color={'#71717a'} />
                        : <IonicsIcon name={val.icon} size={20} color={'#71717a'} />
                    }
                    <Text style={{ fontSize: 10, color: '#71717a', fontWeight: 'bold' }}>{val.link}</Text>
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