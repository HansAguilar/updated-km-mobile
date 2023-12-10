import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TextInput, Pressable, Picker, Alert } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { useDispatch, useSelector } from 'react-redux';
import AntIcon from "react-native-vector-icons/AntDesign";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { updateAppointment } from "../redux/action/AppointmentAction";
import { fetchAdminPayment } from "../redux/action/PaymentAction";
import toastFunction from "../config/toastConfig";
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Button from './Button';

function UpdateModal({ data, setData,setShowPopUp }) {
  const dispatch = useDispatch();
  // const dentist = useSelector((state) => state.dentist.dentists);
  const appointment = useSelector((state) => { return state?.appointment?.appointment.filter((val) => val.status === "PENDING" || val.status === "APPROVED" || val.status === "TREATMENT") });
  // const schedule = useSelector((state) => state.schedule.schedule);
  const [showPicker, setShowPicker] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [inputDetails, setInputDetails] = useState({
    patientId: data.data.patient.patientId,
    dentist: data.data.dentist.dentistId,
    dentalServices: data.data.dentalServices.map((val) => val.serviceId),
    dentistId: `Dr. ${data.data.dentist.fullname}`,
    date: new Date(data.data.appointmentDate),
    timeStart: data.data.timeStart,
    timeEnd: data.data.timeEnd,
  });
  const dateRef = useRef(`${moment(data.data.appointmentDate).format("MMMM DD, YYYY")}`);
  const [suggestion, setSuggestion] = useState([]);
  let [timeStartList, setTimeStartList] = useState(
    [
      { timeValue: "09:00 Am", timeStart: "09:00:00" },
      { timeValue: "09:30 Am", timeStart: "09:30:00" },
      { timeValue: "10:00 Am", timeStart: "10:00:00" },
      { timeValue: "10:30 Am", timeStart: "10:30:00" },
      { timeValue: "11:00 Am", timeStart: "11:00:00" },
      { timeValue: "11:30 Am", timeStart: "11:30:00" },
      { timeValue: "12:00 Am", timeStart: "12:00:00" },
      { timeValue: "01:00 Pm", timeStart: "13:00:00" },
      { timeValue: "01:30 Pm", timeStart: "13:30:00" },
      { timeValue: "02:00 Pm", timeStart: "14:00:00" },
      { timeValue: "02:30 Pm", timeStart: "14:30:00" },
      { timeValue: "03:00 Pm", timeStart: "15:00:00" },
      { timeValue: "03:30 Pm", timeStart: "15:30:00" },
      { timeValue: "04:00 Pm", timeStart: "16:00:00" },
    ]
  );

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const handleOnChange = (name, value) => {
    // if (name === "dentistId") {
    //   const searchDentist = dentist.filter((val) => (val.fullname).toLowerCase().includes(value.toLowerCase()))
    //   setSuggestion([...searchDentist]);
    // }

    setInputDetails({ ...inputDetails, [name]: value })
  }

  const onChangeDate = ({ type }, selectedDate) => {
    if (type === "set") {
      // Adjust the selected date to Philippine time zone
      const adjustedDate = new Date(selectedDate);
      const offset = 480; // Offset in minutes for UTC+8 (Philippine time zone)
      adjustedDate.setMinutes(adjustedDate.getMinutes() + offset);

      setInputDetails({ ...inputDetails, date: adjustedDate })

      const formattedDate = moment(adjustedDate).format("LL");
      dateRef.current = formattedDate;

      if (Platform.OS === "android") {
        setInputDetails({ ...inputDetails, date: adjustedDate })
        dateRef.current = formattedDate;
        toggleDatepicker()
      }
    } else {
      toggleDatepicker()
    }
  };

  const checkAllAppointment = () => {
    const newTimeList = [
      { timeValue: "09:00 Am", timeStart: "09:00:00" },
      { timeValue: "09:30 Am", timeStart: "09:30:00" },
      { timeValue: "10:00 Am", timeStart: "10:00:00" },
      { timeValue: "10:30 Am", timeStart: "10:30:00" },
      { timeValue: "11:00 Am", timeStart: "11:00:00" },
      { timeValue: "11:30 Am", timeStart: "11:30:00" },
      { timeValue: "12:00 Am", timeStart: "12:00:00" },
      { timeValue: "01:00 Pm", timeStart: "13:00:00" },
      { timeValue: "01:30 Pm", timeStart: "13:30:00" },
      { timeValue: "02:00 Pm", timeStart: "14:00:00" },
      { timeValue: "02:30 Pm", timeStart: "14:30:00" },
      { timeValue: "03:00 Pm", timeStart: "15:00:00" },
      { timeValue: "03:30 Pm", timeStart: "15:30:00" },
      { timeValue: "04:00 Pm", timeStart: "16:00:00" },
    ];

    const currentTime = moment();
    const newTime = currentTime.add(1, "hour");
    const newHour = moment(newTime);

    setTimeStartList([...newTimeList]);

    // const removeCurrentTime = newTimeList.filter((val)=>val.timeStart!==appointment.timeStart && val.timeStart!==appointment.timeEnd)
    // setTimeStartList(newTimeList);

    // setTimeStartList((prev) => {
    //   let updatedSchedList = [...prev];
    //   const filteredSchedule = schedule.filter((val) => moment(inputDetails.date, "YYYY-MM-DD").startOf('day').isSame(moment(schedule[0].dateSchedule, "YYYY-MM-DD").startOf('day')) && val.dentist.dentistId === inputDetails.dentistId);

    //   if (filteredSchedule.length > 0) {
    //     const indicesScheduleToRemain = [];
    //     for (let x = 0; x < filteredSchedule.length; x++) {
    //       let start = timeStartList.findIndex((val) => val.timeStart === filteredSchedule[x].timeStart);
    //       let end = timeStartList.findIndex((val) => val.timeStart === filteredSchedule[x].timeEnd);

    //       for (let i = start; i < end; i++) {
    //         indicesScheduleToRemain.push(i);
    //       }
    //     }

    //     updatedSchedList = updatedSchedList.filter((_, idx) => { return indicesScheduleToRemain.includes(idx) });

    //   }
    //   return updatedSchedList;
    // });

    const filteredTime = newTimeList.filter((val) =>
      moment(inputDetails.date, 'YYYY-MM-DD').isSame(moment(), 'day') &&
      moment(val.timeStart, 'HH:mm:ss').isAfter(newHour)
    );

    if (filteredTime.length > 0) {
      setTimeStartList([...filteredTime]);
    }

    setTimeStartList(prevTimeStartList => {
      let updatedTimeList = [...prevTimeStartList];
      const getAllAppointment = appointment
        .filter(val => { return val.status === "PROCESSING" || val.status === "APPROVED" || val.status === "TREATMENT" })
        .filter((val) => {
          return moment(val.appointmentDate).format('LL') === moment(inputDetails.date).format('LL');
        });
      // return moment(val.appointmentDate).format('LL') === moment(appointmentDetails.date).format('LL') && val.dentist.dentistId === appointmentDetails.dentist;
      if (getAllAppointment.length > 0) {
        const indexesToRemove = [];

        for (let x = 0; x < getAllAppointment.length; x++) {
          const start = prevTimeStartList.findIndex((value) => {
            return value.timeStart === getAllAppointment[x].timeStart;
          });
          const end = prevTimeStartList.findIndex((value) => {
            return value.timeStart === getAllAppointment[x].timeEnd;
          });
          for (let begin = start; begin < end; begin++) {
            indexesToRemove.push(begin);
          }
        }
        updatedTimeList = updatedTimeList.filter((_, idx) => {
          return !indexesToRemove.includes(idx);
        })
      }

      return updatedTimeList;
    });
  }

  const timeSelectedButton = () => {
    const patientSameDayAppointment = appointment.filter((val) => {
      const appointmentMoment = moment(val.appointmentDate);
      const inputMoment = moment(inputDetails.date);
      return (
        val.patient.patientId === inputDetails.patientId &&
        val.appointmentId !== data.data.appointmentId &&
        (appointmentMoment.month() === inputMoment.month() &&
          appointmentMoment.date() === inputMoment.date())
      );
    });

    if (patientSameDayAppointment.length > 0) {
      return toastFunction("error", "You have an existing appointment!");
    }
    if (!inputDetails.dentistId || !inputDetails.dentist) {
      return toastFunction("error", "Fill up empty field!")
    }
    const end = calculateTotalTime(inputDetails.timeStart);
    // const totalTimeDuration = moment('00:00:00', 'HH:mm:ss');
    // let start = moment(inputDetails.timeStart, "HH:mm:ss");

    // const filteredAppointment = appointment.filter((val) => {
    //   return (val.status !== "DONE" && val.status !== "CANCELLED")
    //     && moment(val.appointmentDate).isSame(moment(inputDetails.date), "day")
    //     && val.patient.patientId === data.data.patient.patientId;
    // });

    // while (start.isBefore(moment(end, "HH:mm:ss").add(30, 'minutes'))) {
    //   const startTime = start.format('HH:mm:ss');
    //   const matchingTime = timeStartList.find(time => time.timeStart === startTime);
    //   if(startTime === "12:30:00" || startTime === "16:30:00"){
    //     toastFunction("error",`Kindly select ${
    //       totalTimeDuration.format('HH:mm:ss') === "01:00:00"
    //           ? '30 minutes'
    //           : 'less than 1 hour'
    //     } service or change other dates`);
    //     return;
    //   }
    //   if (!matchingTime) {
    //     if ("00:30:00" !== totalTimeDuration.format("HH:mm:ss")) {
    //       toastFunction('error', `Please select time range ${
    //         totalTimeDuration.format('HH:mm:ss') === "00:30:00"
    //           ? 'equal to ' +totalTimeDuration.minute() + ' minutes'
    //           : 'less than or equal to ' +totalTimeDuration.hour() + ' hour'
    //       }`)
    //       return;
    //     }
    //   }
    //   totalTimeDuration.add(30, 'minutes');
    //   start.add(30, "minutes");
    // }
    setInputDetails({
      ...inputDetails,
      timeEnd: end,
      timeSubmitted: moment().format("HH:mm:ss")
    });
    dispatch(updateAppointment(data.data.appointmentId, inputDetails));
    dispatch(fetchAdminPayment(data.data.appointmentId));
    setData({ ...data, isShow: false });
    setShowPopUp(false)
  }

  const calculateTotalTime = (value) => {
    const timeStart = moment(value, "HH:mm:ss");
    return timeStart.add(30, "minutes").format("HH:mm:ss");
  }

  const currentDate = moment();
  currentDate.add(1, 'day');

  useEffect(() => {
    checkAllAppointment();
  }, [inputDetails.date, inputDetails.timeStart]);

  return appointment && (
    <View style={{ height: "100%", width: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", position: 'absolute', zIndex: 10, padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Toast />
      <View style={{ width: "100%", height: "auto", maxHeight: 600, backgroundColor: "white", padding: 20, borderRadius: 6, zIndex: -10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#52525b", width: "100%", paddingBottom: 5, borderBottomWidth: 1, borderColor: "gray" }}>Update Appointment</Text>
        <ScrollView style={{ width: "100%", height: "auto", paddingVertical: 15, }}>

          {/* DENTIST NAME */}
          {/* <View style={{marginBottom:10}}>
                            <Text style={{fontSize:10,fontWeight:"bold",color:"#3f3f46",marginBottom:5}}>Dentist Name</Text>
                            <TextInput 
                                value={inputDetails.dentistId}
                                onChangeText={(text) => handleOnChange("dentistId", text)}
                                style={{
                                    fontSize: 12,
                                    borderWidth: 0.5,
                                    borderColor: "#e4e4e7",
                                    paddingVertical: 3,
                                    paddingHorizontal: 10,
                                    backgroundColor: "#fafafa",
                                    color: "#3f3f46"
                                }}
                            />
                            {
                                suggestion.length > 0 &&  (
                                    <View style={{width:"100%",}}>
                                        {
                                            suggestion.map((val,idx)=>(
                                                <Text 
                                                key={idx} 
                                                style={{paddingHorizontal:10, paddingVertical:5,backgroundColor:"#f4f4f5", color:"#a1a1aa"}}
                                                onPress={()=>{
                                                    setInputDetails({
                                                        ...inputDetails,
                                                        dentist:val.dentistId,
                                                        dentistId:`Dr. ${val.fullname}`
                                                    });
                                                    setSuggestion([]);
                                                }}
                                                >Dr. {val.fullname}</Text>
                                            ))
                                        }
                                    </View>
                                )
                            }
                            
                    </View> */}

          {/*DATE */}
          <View style={{ marginBottom: 10, gap: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#3f3f46" }}>Select starting date</Text>
            {
              showPicker && (
                <DateTimePicker
                  mode="date"
                  display='spinner'
                  value={inputDetails.date}
                  onChange={onChangeDate}
                  maximumDate={moment().add(5, 'months').endOf('month').toDate()} // Set maximumDate to 5 months from now
                  minimumDate={currentDate.toDate()} // Set the minimumDate to the previous day
                  androidMode="calendar"
                  {...(Platform.OS === 'ios' && { datePickerModeAndroid: 'spinner' })}
                  {...(Platform.OS === 'ios' && { maximumDate: moment().add(5, 'months').endOf('month').toDate() })}
                  {...(Platform.OS === 'android' && { minDate: moment().startOf('month').toDate() })}
                  {...(Platform.OS === 'android' && { maxDate: moment().add(5, 'months').endOf('month').toDate() })}
                  {...(Platform.OS === 'android' && { minDate: moment().toDate() })}
                />
              )
            }
            {
              !showPicker && (
                <Pressable
                  style={{ width: '100%' }}
                  onPress={toggleDatepicker}
                >
                  <TextInput
                    value={dateRef.current}
                    name="date"
                    editable={false}
                    style={{ fontSize: 12, borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 3, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46" }}
                    onChangeText={(text) => handleOnChange("date", text)}
                    placeholder={"Select Appointment Date"}
                  />
                </Pressable>
              )
            }
          </View>

          {/*TIMESTART */}
          <View style={{ paddingBottom: 30, gap: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#3f3f46" }}>Appointment Start</Text>
            <Pressable onPress={() => setShowTime(true)}>
              <TextInput
                value={moment(inputDetails.timeStart, "HH:mm:ss").format('hh:mm A')}
                editable={false}
                style={{ fontSize: 12, borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 3, paddingHorizontal: 10, backgroundColor: "#f2f2f2", color: "#3f3f46" }}
              />
            </Pressable>
            {
              showTime && (
                <View style={{ width: "100%", }}>
                  {
                    timeStartList
                      .filter((val) => val.timeStart !== "12:00:00" && val.timeStart !== "16:00:00")
                      .map((val, idx) => (
                        <View key={idx} style={{borderColor: "#f2f2f2", borderWidth: 1}}>
                          {inputDetails.timeStart === val.timeStart
                            ? <Text
                              key={idx}
                              style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#e5e7eb", color: "#a1a1aa", }}
                            >{val.timeValue}</Text>

                            : <Text
                              key={idx}
                              style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#fff", color: "#a1a1aa", }}
                              onPress={() => {
                                setInputDetails({ ...inputDetails, timeStart: val.timeStart });
                                setShowTime(false)
                              }}
                            >{val.timeValue}</Text>
                          }
                        </View>
                      ))
                  }
                </View>
              )
            }
          </View>


        </ScrollView>
        <View style={{ width: "100%", height: "auto", display: "flex", flexDirection: 'row', columnGap: 10 }}>
          <Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#ef4444", color: "#fff", borderRadius: 6 }} onPress={() => setData({ ...data, isShow: false })}>Cancel</Text>
          <Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#06b6d4", color: "#fff", borderRadius: 6 }} onPress={timeSelectedButton}>Save Changes</Text>
        </View>
      </View>
    </View>
  );
}

export default UpdateModal;