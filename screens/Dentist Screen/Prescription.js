import React from 'react';
import { View, Text, Image, Dimensions, Pressable, Button, } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from "../../style/styles";
import EntypoIcon from 'react-native-vector-icons/Entypo';
import DentistCard from '../../components/DentistCard';
import Modal from '../../components/TreatmentModal';
import moment from 'moment';
import { useState } from 'react';
import TextInput from "../../components/InputText";
import { createPrescription } from "../../redux/action/PrescriptionAction";
import ToastFunction from "../../config/toastConfig";
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-gesture-handler';

function Prescription({ setSideNavShow, navigation }) {
  const patient = useSelector((state) => { return state.patient.patientList; });
  const { activeDentist } = useSelector((state) => { return state.dentist });
  const { width, height } = Dimensions.get("screen");
  const [data, setData] = useState({
    dentist: activeDentist.dentistId,
    patientName: "",
    patient: "",
    remarks: ""
  });

  const [descriptionMenu, setDescriptionMenu] = useState([
    {
      medicineName: "Mefenamic Acid",
      capsuleNo: "",
      hour: "",
      days: "",
      isSelect: false
    },
    {
      medicineName: "Amoxicillin",
      capsuleNo: "",
      hour: "",
      days: "",
      isSelect: false
    },
    {
      medicineName: "Tranexamic Acid",
      capsuleNo: "",
      hour: "",
      days: "",
      isSelect: false
    },
  ]);

  const [suggestion, setSuggestion] = useState([]);
  const dispatch = useDispatch();

  const handleChange = (name, value) => {
    if (name === "patientName") {
      const filteredPatient = patient.filter((val) => (val.firstname + val.lastname).toLowerCase().includes(value.toLowerCase()));
      setSuggestion(filteredPatient);
    }
    setData({ ...data, [name]: value });
  }

  const handleSubmit = () => {
    if (!data.patient) {
      returnToastFunction("error", "Fill up empty field!");
    }
    if (descriptionMenu.filter((v) => !v.isSelect).length === 3) {
      return ToastFunction("error", "Please select medicine");
    } else if (descriptionMenu.some(item => item.isSelect && (!item.capsuleNo || !item.hour || !item.days))) {
      return ToastFunction("error", "Fill up your selected info");
    }

    let description = "".concat(descriptionMenu.filter(v => v.isSelect).map((v => writeMessage(v.medicineName, v.capsuleNo, v.hour, v.days))));
    const newData = { ...data, remarks: description }
    dispatch(createPrescription(newData));
    navigation.navigate("Dashboard");
  }

  const writeMessage = (name, capsule, hours, days) => `\n\n${name} 500 mg ${capsule} # capsule\nSig: Take 1 Capsule every ${hours} hrs for ${days} days.`;

  const selectedDescriptionMenu = (idx) => setDescriptionMenu((prev) => prev.map((v, id) => (id === idx ? {
    ...v,
    isSelect: !v.isSelect,
    capsuleNo: "",
    hour: "",
    days: ""
  } : v)));

  const handleDescriptionMenu = (name, idx, value) => {
    const updatedMenu = descriptionMenu.map((val, id) => { return id === idx ? { ...val, [name]: value } : val; });
    setDescriptionMenu(updatedMenu);
  };

  return (
    <>

      <ScrollView style={{ ...styles.containerGray, height: height, width: width, position: 'relative', padding: 20, marginBottom: 50, zIndex: 0 }}>

        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Add Prescription</Text>

        {/* PATIENT */}
        <View style={{ marginBottom: 10, marginTop: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Patient</Text>
          <TextInput
            value={data.patientName}
            name="patientName"
            onChangeText={handleChange}
            style={{ fontSize: 12, borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 3, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46" }} />

          <View style={{ width: "100%", height: "auto", padding: 5 }}>
          </View>
          {
            suggestion.length > 0 && data.patientName ?
              suggestion.map((val, idx) => (
                <Pressable style={{ backgroundColor: "#fff", marginBottom: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10 }} key={idx}
                  onPress={() => {
                    setData({ ...data, patient: val.patientId, patientName: `${val.firstname} ${val.lastname}` });
                    setSuggestion([]);
                  }}
                >
                  <Text >{val.firstname} {val.lastname}</Text>
                </Pressable>
              ))
              : !data.patientName && suggestion.length < 1 ?
                <View style={{ marginBottom: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10 }}>
                  <Text >No existing patient</Text>
                </View>
                : <Text></Text>
          }
        </View>

        {/* Medicine Selection */}
        <View style={{ width: "100%", height: "auto", display: 'flex', rowGap: 10, marginBottom: 10 }}>
          {
            descriptionMenu.map((val, idx) => (
              <Pressable
                key={idx}
                style={{ backgroundColor: "white", paddingVertical: 10, paddingHorizontal: 10, height: "auto" }}
                onPress={() => selectedDescriptionMenu(idx)}
              >
                <Text>{val.medicineName}</Text>
                {
                  val.isSelect && (
                    <View style={{ backgroundColor: "#f3f4f6", padding: 10, display: 'flex', rowGap: 5 }}>

                      {/* CAPSULE NO. */}
                      <TextInput
                        value={val.capsuleNo}
                        name="capsuleNo"
                        onChangeText={(name, text) => handleDescriptionMenu(name, idx, text)}
                        style={{ width: "100%", padding: 10, borderWidth: 1 }}
                        keyboardType={"phone-pad"}
                        placeholder="Enter Capsule no."
                      />

                      {/* Hours */}
                      <TextInput
                        value={val.hour}
                        name="hour"
                        onChangeText={(name, text) => handleDescriptionMenu(name, idx, text)}
                        style={{ width: "100%", padding: 10, borderWidth: 1 }}
                        keyboardType={"phone-pad"}
                        placeholder="Enter number of hours"
                      />

                      {/* Days */}
                      <TextInput
                        value={val.days}
                        name="days"
                        onChangeText={(name, text) => handleDescriptionMenu(name, idx, text)}
                        style={{ width: "100%", padding: 10, borderWidth: 1 }}
                        keyboardType={"phone-pad"}
                        placeholder="Enter days"
                      />
                    </View>
                  )
                }
              </Pressable>
            ))
          }
        </View>

        <Text style={{ width: "100%", backgroundColor: "#06b6d4", color: "#fff", borderRadius: 10, paddingVertical: 10, textAlign: 'center' }} onPress={handleSubmit}>Submit</Text>

      </ScrollView>
      <Toast />
    </>
  )
}

export default React.memo(Prescription)