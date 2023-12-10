import React from 'react';
import { View, Text, Dimensions, Pressable, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from "../../style/styles";
import InputText from '../../components/InputText';
import moment from 'moment';
import { useState } from 'react';
import { createPrescription } from "../../redux/action/PrescriptionAction";
import ToastFunction from "../../config/toastConfig";
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-gesture-handler';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { fetchAllPatient,} from '../../redux/action/PatientAction';
import { useEffect } from 'react';
import Loader from '../../components/Loader';

function Prescription({ setSideNavShow, navigation }) {
  const { activeDentist } = useSelector((state) => { return state.dentist });
  const patient = useSelector((state) => { return state?.patient?.patientList });
  const { width, height } = Dimensions.get("screen");
  const [data, setData] = useState({
    dentist: activeDentist.dentistId,
    patientName: "",
    patient: "",
    remarks: ""
  });
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(fetchAllPatient());
  },[])

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

  const handleChange = (name, value) => {
    if (name === "patientName") {
      filterPatients(value);
    }
    setData((prev) => ({ ...prev, [name]: value }));
  }

  const filterPatients = (value) => {
    const filteredPatient = patient.filter((val) => (val.firstname + val.lastname).toLowerCase().includes(value.toLowerCase()));
    setSuggestion(filteredPatient);
  }

  const handleSubmit = () => {
    if (!data.patient) {
      return ToastFunction("error", "Fill up empty field!");
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
      {
        !patient ? (<Loader loading={true} />)
        : (
          <>
            <ScrollView style={{ ...styles.containerGray, height: height, width: width, position: 'relative', padding: 20, marginBottom: 50, zIndex: 0 }}>

            {/* PATIENT */}
            <View style={{ marginBottom: 10, marginTop: 10 }}>

              <View style={{ width: "100%", gap: 4, }}>
                <Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Patient Name</Text>
                <TextInput onChangeText={(value) => handleChange("patientName", value)} name="patientName" value={data.patientName} placeholder="Search patient" style={style.inputTextStyle} />
              </View>

              {
                suggestion?.length > 0 && data.patientName ?
                  suggestion.map((val, idx) => (
                    <Pressable style={{ marginTop: 2, backgroundColor: "#cef6fd", borderBottomLeftRadius: 4, borderBottomRightRadius: 4, padding: 10, borderBottomColor: "#06b6d4", borderBottomWidth: suggestion.length > 1 ? 1 : 0 }} key={idx}
                      onPress={() => {
                        setData({ ...data, patient: val.patientId, patientName: `${val.firstname} ${val.lastname}` });
                        setSuggestion([]);
                      }}
                    >
                      <Text style={{ color: "#06b6d4" }}>{val.firstname} {val.lastname}</Text>
                    </Pressable>
                  ))
                  : suggestion?.length < 1 ?
                    <View style={{ marginTop: 2, padding: 10, backgroundColor: "#fce9e9" }}>
                      <Text style={{ color: "#dd2222" }}>No existing patient</Text>
                    </View>
                    : <Text></Text>
              }
            </View>


            <Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Write a medicine</Text>
            {/* Medicine Selection */}
            <View style={{ width: "100%", rowGap: 10, marginBottom: 10, marginTop: 4 }}>
              {
                descriptionMenu?.map((val, idx) => (
                  <Pressable
                    key={idx}
                    style={{ backgroundColor: "#07bedf", paddingVertical: 10, paddingHorizontal: 10, gap: 6 }}
                    onPress={() => selectedDescriptionMenu(idx)}
                  >
                    <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 14, fontWeight: "500", color: "#fff" }}>{val.medicineName}</Text>
                      <SimpleLineIcons name='arrow-up' size={15} color="#fff" />
                    </View>
                    {
                      val.isSelect && (
                        <View style={{ padding: 10, rowGap: 5 }}>

                          {/* CAPSULE NO. */}
                          {/* <TextInput onChangeText={(name, text) => handleDescriptionMenu("capsuleNo", idx, text)} name="capsuleNo" value={val.capsuleNo} placeholder="Enter Capsule no." style={style.inputTextStyle} keyboardType={"phone-pad"} />

                          <TextInput onChangeText={(name, text) => handleDescriptionMenu("hour", idx, text)} name="hour" value={val.hour} placeholder="Enter number of hours" style={style.inputTextStyle} keyboardType={"phone-pad"} />

                          <TextInput onChangeText={(name, text) => handleDescriptionMenu("days", idx, text)} name="days" value={val.days} placeholder="Enter days" style={style.inputTextStyle} keyboardType={"phone-pad"} /> */}

                          <InputText
                            value={val.capsuleNo}
                            name="capsuleNo"
                            onChangeText={(name, text) => handleDescriptionMenu(name, idx, text)}
                            style={{ width: "100%", padding: 10, borderWidth: 1 }}
                            keyboardType={"phone-pad"}
                            placeholder="Enter Capsule no."
                          />

                          {/* Hours */}
                          <InputText
                            value={val.hour}
                            name="hour"
                            onChangeText={(name, text) => handleDescriptionMenu(name, idx, text)}
                            style={{ width: "100%", padding: 10, borderWidth: 1 }}
                            keyboardType={"phone-pad"}
                            placeholder="Enter number of hours"
                          />

                          {/* Days */}
                          <InputText
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

            <Text style={{ width: "100%", backgroundColor: "#06b6d4", color: "#fff", fontWeight: "bold", borderRadius: 4, paddingVertical: 10, marginTop: 20, textAlign: 'center' }} onPress={handleSubmit}>Send prescription</Text>

            </ScrollView>
            <Toast />
          </>
        )
      }    
    </>
  )
}

export default React.memo(Prescription);

const style = {
  inputTextStyle: {
    borderColor: "#e6e6e6",
    borderWidth: 1, padding: 4,
    borderRadius: 4, paddingLeft: 10,
    backgroundColor: "#fff"
  }
}