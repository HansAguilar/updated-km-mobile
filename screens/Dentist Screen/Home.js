import React from 'react';
import { View, Text, Image, Dimensions, Pressable, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from "../../style/styles";
import EntypoIcon from 'react-native-vector-icons/Entypo';
import DentistCard from '../../components/DentistCard';
import Modal from '../../components/TreatmentModal';
import moment from 'moment';
import { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native-gesture-handler';

function Home({ navigation, setSideNavShow, setAppointmentId }) {
  const { activeDentist } = useSelector((state) => { return state.dentist; });
  const appointment = useSelector(state => state?.appointment?.appointment?.filter((val) => val.dentist.dentistId === activeDentist?.dentistId));
  const patient = useSelector((state) => {
    return state?.appointment?.appointment?.filter((val) =>
      (val.status !== "DONE" && val.status !== "CANCELLED" && val.status !== "TREATMENT_DONE")
      && val.dentist.dentistId === activeDentist?.dentistId
    );
  });
  const consultation = useSelector((state) => {
    return state?.appointment?.appointment?.filter((val) =>
      (val.status === "APPROVED" || val.status === "PROCESS")
      && val.dentist.dentistId === activeDentist?.dentistId
    );
  });
  const treatment = useSelector((state) => {
    return state?.appointment?.appointment?.filter((val) =>
      val.status === "TREATMENT" && val.dentist.dentistId === activeDentist?.dentistId
    );
  });
  const processing = useSelector((state) => {
    return state?.appointment?.appointment?.filter((val) =>
      (val.status === "PROCESSING" || val.status === "TREATMENT_PROCESSING") && val.dentist.dentistId === activeDentist?.dentistId
    );
  });
  const { width, height } = Dimensions.get("screen");
  const [modal, setModal] = useState(false);
  const [treatmentData, setTreatmentData] = useState(null);


  const currentPatient = appointment.filter((val) => val.status === "PROCESSING" || val.status === "TREATMENT_PROCESSING");
  // THIS IS THE CORRECT
  // const currentPatient = appointment.filter((val)=>val.status==="PROCESSING"&&val.status==="TREATMENT_PROCESSING" && moment(val.appointmentDate,"YYYY-MM-DD").isSame(moment(), 'day'));

  return activeDentist && (
    <SafeAreaView style={{ ...styles.containerGray, height: height, width: width, position: 'relative' }}>

      {modal && (<Modal setModal={setModal} treatmentData={treatmentData} />)}

      <SafeAreaView style={{ width: width, height: height / 3, backgroundColor: "#06b6d4", ...styles.shadow, justifyContent: 'center' }} >

        <Pressable onPress={() => { setSideNavShow(true) }} style={{ position: 'absolute', top: 40, left: 10, zIndex: 20 }}>
          <EntypoIcon name='menu' size={30} color={'#fff'} />
        </Pressable>

        <View style={{ width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 60, rowGap: 10 }}>
          <Image source={{ uri: activeDentist.profile }} style={{ width: 115, height: 115, borderRadius: 100 }} alt='Dentist Profile' />
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>Dr. {activeDentist.fullname}</Text>
            <Text style={{ color: "#fff", fontSize: 12 }}>Dentist</Text>
          </View>
        </View>
        {/* <Pressable style={{ position: 'absolute', top: 40, right: 10, zIndex: 20 }}>
          <Ionicons name="notifications" color="#fff" size={30} />
          <Text style={{ backgroundColor: '#e62e00', color: 'white', width: 20, height: 20, position: 'absolute', right: 0, textAlign: 'center', borderRadius: 100 }}>1</Text>
        </Pressable> */}
      </SafeAreaView>

      <View style={{ padding: 15, rowGap: 10, }}>
        <View style={{ flexDirection: 'row', columnGap: 10 }}>
          <View style={{ width: '48%', backgroundColor: '#06b6d4', borderRadius: 6, height: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>{patient.length}</Text>
            <Text style={{ color: '#fff', fontSize: 15 }}>Patients</Text>
          </View>

          <View style={{ width: '48%', backgroundColor: '#06b6d4', borderRadius: 6, height: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>{processing.length}</Text>
            <Text style={{ color: '#fff', fontSize: 15 }}>For Processing</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', columnGap: 10 }}>
          <View style={{ width: '48%', backgroundColor: '#06b6d4', borderRadius: 6, height: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>{consultation.length}</Text>
            <Text style={{ color: '#fff', fontSize: 15 }}>Consultation</Text>
          </View>

          <View style={{ width: '48%', backgroundColor: '#06b6d4', borderRadius: 6, height: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>{treatment.length}</Text>
            <Text style={{ color: '#fff', fontSize: 15 }}>Treatment</Text>
          </View>
        </View>

      </View>

      <DentistCard header="Today's Patients" data={currentPatient} setModal={setModal} setTreatmentData={setTreatmentData} setAppointmentId={setAppointmentId} navigation={navigation} />

    </SafeAreaView >
  )
}

export default Home