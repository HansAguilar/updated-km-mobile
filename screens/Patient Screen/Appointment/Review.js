import React, { useState } from 'react';
import { ScrollView, View, Text, Image, Dimensions, TouchableHighlight } from 'react-native';
import { styles } from '../../../style/styles';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { createAppointment } from '../../../redux/action/AppointmentAction';
import { createNotification } from '../../../redux/action/NotificationAction';
import ToastFunction from '../../../config/toastConfig';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import * as io from "socket.io-client";
import { SOCKET_LINK } from '../../../config/APIRoutes';
import Button from '../../../components/Button';
import kmlogo from "../../../assets/images/kmlogo.jpg";

const socket = io.connect(SOCKET_LINK);
function Review({ navigation, appointmentDetails }) {
  const { height } = Dimensions.get("screen");
  const dispatch = useDispatch();
  const [isAvailable, setModal] = useState(false);
  const { dentists } = useSelector((state) => { return state.dentist });
  const { services } = useSelector((state) => { return state.services });
  const { appointment, error } = useSelector((state) => { return state.appointment });
  const { patient } = useSelector((state) => { return state.patient });

  const dentist = dentists.filter(val => { return val.dentistId === appointmentDetails.dentist });
  const selectedServices = services.filter(val => { return appointmentDetails.dentalServices.includes(val.serviceId); });

  const rules = [
    {
      title: "Appointment Scheduling",
      description: "Patients are required to schedule their appointments with our dental clinic in advance. Appointments can be scheduled over the phone, through our website or in person. We recommend that you schedule your appointment as soon as possible to ensure availability."
    },
    {
      title: "Cancellation Policy",
      description: "We understand that unforeseen circumstances may arise that could force you to cancel your appointment. However, we kindly ask that you give us at least 24 hours notice if you need to cancel or reschedule your appointment. Failure to provide sufficient notice may result in a cancellation fee or the loss of your deposit."
    },
    {
      title: "Late Arrivals",
      description: "We ask that patients arrive on time for their appointments. If you are running late, please notify us as soon as possible. If you arrive late for your appointment, we may not be able to see you and you may need to reschedule for a later time."
    },
    {
      title: "Payment Policy",
      description: "Payment is due at the time of your appointment. We accept cash, e-payment and insurance payments. If you have dental insurance, we will need to verify your coverage before your appointment."
    },
    {
      title: "Insurance",
      description: "We accept most major dental insurance plans. Please bring your insurance card with you to your appointment. If your insurance requires a co-pay or deductible, it will be due at the time of your appointment."
    },
    {
      title: "Treatment Plans",
      description: "Our dentists will create a personalized treatment plan for each patient based on their individual needs. We will provide a detailed explanation of the treatment plan, including the estimated cost and duration of treatment. If you have any questions or concerns, please do not hesitate to ask."
    },
    {
      title: "Consent Forms",
      description: "Before any treatment is performed, patients will be required to sign consent forms. These forms will provide information about the treatment, the risks and benefits, and any alternatives that may be available."
    },
    {
      title: "Privacy Policy",
      description: "Our dental clinic takes patient privacy very seriously. We will not share your personal information with any third parties without your consent."
    },
    {
      title: "Emergencies",
      description: "If you experience a dental emergency outside of our regular office hours, please call our emergency number for assistance."
    },
    {
      title: "Agreement",
      description: "By scheduling an appointment with our dental clinic, you agree to these terms and conditions."
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
      ${moment(appointmentDetails.date).format("L").toString() === moment().format("L").toString() ? "today" : "on"} 
      ${moment(appointmentDetails.date).format("MMM DD YYYY")}`,
      receiverType: "ADMIN"
    }
    await dispatch(createAppointment(appointmentDetails, navigation, ToastFunction, setModal));
    await dispatch(createNotification(data));
  };

  const Modal = () => {
    return isAvailable && (
      <View style={{ width: '100%', height: height, backgroundColor: '#f2f2f2', position: 'relative', zIndex: 500, padding: 10 }}>
        <View style={{ width: '100%', height: "80%" }}>

          <View style={{ width: '100%', display: 'flex', flexDirection: "column", alignItems: 'center', marginBottom: 10 }}>
            <Image source={require("../../../assets/images/small-logo.jpg")} style={{ width: 65, height: 65, borderRadius: 50 }} />
            <Text style={{ textTransform: 'uppercase', fontWeight: 'bold', color: "#475569", fontSize: 18 }}>Terms and condition</Text>
            <Text style={{ color: "#F97316", fontSize: 14 }}>Last Revised: April 22, 2023</Text>
          </View>

          <ScrollView style={{ width: "100%", marginTop: 10, paddingHorizontal: 10 }}>
            {
              rules.map((val, idx) => (
                <View style={{ width: '100%', paddingVertical: 10 }} key={idx}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>{idx + 1}. {val.title}</Text>
                  <Text style={{ fontSize: 14, color: "#2b2b2b", textAlign: 'justify' }}>{val.description}</Text>
                </View>
              ))
            }
          </ScrollView>

          <View style={{ padding: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', ...styles.shadow }}>
            <TouchableHighlight style={{ width: 120, paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: '#2C3E50', borderRadius: 6 }} onPress={() => setModal(false)}>
              <Text style={{ fontWeight: "500", textAlign: 'center', textTransform: 'uppercase', fontSize: 13, color: "#2C3E50" }}>Decline</Text>
            </TouchableHighlight>
            <TouchableHighlight style={{ paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#06b6d4', borderRadius: 6 }} onPress={submitButton}>
              <Text style={{ fontWeight: "500", width: 100, textAlign: 'center', textTransform: 'uppercase', fontSize: 13, color: "#fff" }}>accept</Text>
            </TouchableHighlight>
          </View>

        </View>
      </View>
    )
  }

  return (
    <>
      <Toast />
      <Modal />
      <ScrollView style={{ ...styles.containerGray, padding: 20, position: 'relative' }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: '500', color: "#3f3f46" }}>Appointment Summary</Text>
        </View>

        <View style={{ marginTop: 60, position: "relative", alignItems: "center", backgroundColor: '#fff', borderRadius: 6, }}>
          <Image style={style.logoStyle} source={kmlogo} />

          <View style={{ borderBottomColor: '#f2f2f2', borderBottomWidth: 2, width: "100%", paddingTop: 50, paddingBottom: 20 }}>
            <View style={{ flexDirection: "column", alignItems: "center", gap: 2, width: "100%" }}>
              <Text style={{ fontSize: 14, fontWeight: "400", color: "#bfbfbf" }}>Appointment for</Text>
              <Text style={{ fontSize: 20, fontWeight: "500", color: "#2b2b2b", letterSpacing: .2 }}>{patient.firstname + " " + patient.lastname}</Text>
            </View>
          </View>

          <View style={{ borderBottomColor: '#f2f2f2', borderBottomWidth: 2, width: "100%", paddingVertical: 20 }}>
            {/* <Image source={{ uri: dentist[0].profile }} style={{ width: 35, height: 35, borderRadius: 50 }} /> */}
            <View style={{ flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
              <View style={{ alignItems: "center", gap: 2, }}>
                <Text style={{ fontSize: 14, fontWeight: "400", color: "#bfbfbf" }}>Appointment with</Text>
                <Text style={{ fontSize: 14, color: '#2b2b2b', fontWeight: '500' }}>Dr. {dentist[0].fullname}</Text>
              </View>
              <View style={{ alignItems: "center", gap: 2, }}>
                <Text style={{ fontSize: 14, color: '#06b6d4', fontWeight: '500' }}>{moment(appointmentDetails.date).format("dddd, MMMM Do YYYY")}</Text>
                <Text style={{ fontSize: 14, color: '#06b6d4', fontWeight: '500' }}>{moment(appointmentDetails.timeStart, 'HH:mm:ss').format('h:mm A')} - {moment(appointmentDetails.timeEnd, 'HH:mm:ss').format('h:mm A')}</Text>
              </View>
              {/* <Text style={{fontSize:12}}>{moment(appointmentDetails.date).format("LL")}</Text> */}
            </View>
          </View>

          <View style={{ borderBottomColor: '#f2f2f2', borderBottomWidth: 2, width: "100%", padding: 15, gap: 15 }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
              <Text style={{ fontSize: 14, color: "#595959" }}>Services:</Text>
              <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
                {
                  selectedServices.map((val, idx) => (
                    <View style={{ flexDirection: "row", alignItems: "center" }} key={idx}>
                      <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>{val.name}</Text>
                      {/* <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>{val.type} </Text> */}
                    </View>
                  ))
                }
              </View>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
              <Text style={{ fontSize: 14, color: "#595959" }}>Payment Type:</Text>
              <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>{appointmentDetails.type}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
              <Text style={{ fontSize: 14, color: "#595959" }}>Payment Method:</Text>
              <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>{appointmentDetails.method}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
              <Text style={{ fontSize: 16, color: "#595959" }}>Total Amount:</Text>
              <Text style={{ fontSize: 16, fontWeight: "500", color: "#3f3f3f" }}>₱ {appointmentDetails.totalAmount.toLocaleString()}</Text>
            </View>
          </View>

          <Text style={{ fontSize: 11, fontWeight: "500", color: "#2b2b2b", paddingVertical: 20 }}>Please review your appointment details above to ensure accuracy.</Text>

        </View>
      </ScrollView >

      <View style={{ width: '100%', padding: 20, position: 'relative' }}>
        <Button title='Confirm Appointment' bgColor='#06b6d4' textColor='#fff' onPress={() => setModal(true)} />
      </View>
    </>
  )
}

export default React.memo(Review);


const style = {
  logoStyle: {
    width: 80, height: 80,
    resizeMode: 'contain', aspectRatio: 1,
    borderRadius: 50, borderWidth: 1, borderColor: "#e6e6e6",
    position: "absolute", zIndex: 10, top: -40, alignItems: "center"
  },
}