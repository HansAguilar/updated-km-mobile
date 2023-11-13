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

function Home({ setSideNavShow }) {
  const { activeDentist } = useSelector((state) => { return state.dentist; });
  const appointment = useSelector((state) => { return state.appointment.appointment; });
  const { width, height } = Dimensions.get("screen");
  const [modal, setModal] = useState(false);
  const [treatmentData, setTreatmentData] = useState(null);

  // const currentPatient = appointment.filter((val)=>val.status==="PROCESSING" );
  const currentPatient = appointment.filter((val) => val.status === "PROCESSING" || val.status === "TREATMENT_PROCESSING" && moment(val.appointmentDate, "YYYY-MM-DD").isSame(moment(), 'day'));

  return activeDentist && (
    <SafeAreaView style={{ ...styles.containerGray, height: height, width: width, position: 'relative' }}>

      {modal && (<Modal setModal={setModal} treatmentData={treatmentData} />)}

      <SafeAreaView style={{ width: width, height: height / 3, backgroundColor: "#00ace6", ...styles.shadow, justifyContent: 'center' }} >

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

        <Pressable style={{ position: 'absolute', top: 40, right: 10, zIndex: 20 }}>
          <Ionicons name="notifications" color="#fff" size={30} />
          <Text style={{ backgroundColor: '#e62e00', color: 'white', width: 20, height: 20, position: 'absolute', right: 0, textAlign: 'center', borderRadius: 100 }}>1</Text>
        </Pressable>
      </SafeAreaView>

      <View style={{ padding: 15, rowGap: 10 }}>
        <View style={{ flexDirection: 'row', columnGap: 10 }}>

          <View style={{ width: '48%', backgroundColor: '#00ace6', borderRadius: 10, height: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>28</Text>
            <Text style={{ color: '#fff', fontSize: 15 }}>Patients</Text>
          </View>

          <View style={{ width: '48%', backgroundColor: '#00ace6', borderRadius: 10, height: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>12</Text>
            <Text style={{ color: '#fff', fontSize: 15 }}>Appointments</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', columnGap: 10 }}>
          <View style={{ width: '48%', backgroundColor: '#00ace6', borderRadius: 10, height: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>2</Text>
            <Text style={{ color: '#fff', fontSize: 15 }}>Schedule</Text>
          </View>

          <View style={{ width: '48%', backgroundColor: '#00ace6', borderRadius: 10, height: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>4</Text>
            <Text style={{ color: '#fff', fontSize: 15 }}>Treatment</Text>
          </View>
        </View>

      </View>

      <DentistCard header="Current Patient" data={currentPatient} setModal={setModal} setTreatmentData={setTreatmentData} />

    </SafeAreaView >
  )
}

export default Home