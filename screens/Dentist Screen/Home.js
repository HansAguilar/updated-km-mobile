import React,{ useMemo, useEffect } from 'react';
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
import stackbg from "../../assets/images/stackprofile.png";

function Home({ navigation, setSideNavShow, setAppointmentId }) {
  const { activeDentist } = useSelector((state) => { return state.dentist; });
  const appointment = useSelector(state => state?.appointment?.dentistAppointment);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const handleShowPopUp = (item) => {
    setSelectedItem(item);
    setShowPopUp(prev => !prev);
  }

  const patient = useMemo(()=>{
    const listOfPatient = [];
    const filteredPatient = appointment.filter((val)=>(val.status !== "DONE" && val.status !== "CANCELLED"&& val.status !== "TREATMENT_DONE"));
    for(let x=0; x<filteredPatient.length;x++){
      if(listOfPatient.length === 0){
        listOfPatient.push(filteredPatient[x].patient.patientId);
      }else if(!listOfPatient.includes(filteredPatient[x].patient.patientId)){
        listOfPatient.push(filteredPatient[x].patient.patientId);
      }
    }
    return listOfPatient;
  },[appointment]);


  const consultation = useMemo(()=>{
    return appointment.filter((val)=>(val.status === "APPROVED" || val.status === "PROCESS"))
  }, [appointment]);

  const treatment = useMemo(()=>{
    return appointment.filter((val)=>val.status === "TREATMENT")
  },[appointment]);

  const processing = useMemo(()=>{
    return appointment.filter((val)=>(val.status === "PROCESSING" || val.status === "TREATMENT_PROCESSING"))
  },[appointment]);

  const { width, height } = Dimensions.get("screen");
  const [modal, setModal] = useState(false);
  const [treatmentData, setTreatmentData] = useState(null);


  // const currentPatient = useMemo(()=>{
  //   return appointment.filter((val) => ((val.status === "PROCESSING" || val.status === "TREATMENT_PROCESSING")&& moment(val.appointmentDate,"YYYY-MM-DD").isSame(moment(), 'day')))
  // }, [appointment]);
  const currentPatient = useMemo(()=>{
    const result = appointment.filter((val)=>{
      return val.status === "PROCESSING" || val.status === "TREATMENT_PROCESSING"
    });
    return result;
  }, [appointment]);

  return(
    <SafeAreaView style={{ ...styles.containerGray, height: height, width: width, position: 'relative' }}>

      {modal && (<Modal setModal={setModal} treatmentData={treatmentData} />)}

      <SafeAreaView style={{ width: width, height: height / 3, backgroundColor: "#06b6d4", ...styles.shadow, justifyContent: 'center' }} >

        <Pressable onPress={() => { setSideNavShow(true) }} style={{ position: 'absolute', top: 40, left: 10, zIndex: 20 }}>
          <EntypoIcon name='menu' size={30} color={'#fff'} />
        </Pressable>

        <Image source={stackbg} style={{ width: "100%", position: "absolute", zIndex: 0, borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }} />

        <View style={{ width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 60, rowGap: 10 }}>
          <Image source={{ uri: activeDentist.profile }} style={{ width: 115, height: 115, borderRadius: 100 }} alt='Dentist Profile' />
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "400", fontSize: 24, borderBottomColor: "#06b6d4", borderBottomWidth: 1 }}>Hello <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 24 }}>Dr. {activeDentist.fullname}</Text></Text>
            <Text style={{ color: "#fff", fontSize: 16 }}>Dentist</Text>
          </View>
        </View>
        {/* <Pressable style={{ position: 'absolute', top: 40, right: 10, zIndex: 20 }}>
          <Ionicons name="notifications" color="#fff" size={30} />
          <Text style={{ backgroundColor: '#e62e00', color: 'white', width: 20, height: 20, position: 'absolute', right: 0, textAlign: 'center', borderRadius: 100 }}>1</Text>
        </Pressable> */}
      </SafeAreaView>

      <View style={{ padding: 15, rowGap: 10 }}>
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

      <DentistCard header="Today's Patients"
        data={currentPatient}
        showPopUp={showPopUp}
        setShowPopUp={setShowPopUp}
        setModal={setModal}
        setTreatmentData={setTreatmentData}
        setAppointmentId={setAppointmentId}
        navigation={navigation}
        selectedItem={selectedItem}
        GhandleShowPopUp={handleShowPopUp} />

    </SafeAreaView >
  )
}

export default React.memo(Home)