import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../../../style/styles';
import { useSelector } from 'react-redux';
import InputText from '../../../components/InputText';
import ToastFunction from '../../../config/toastConfig';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Button from '../../../components/Button';

const Schedule = ({ navigation, appointmentDetails, setAppointmentDetails }) => {
  const appointment = useSelector((state) => { return state.appointment.appointment.filter((val) => val.status === "PENDING" || val.status === "APPROVED" || val.status === "TREATMENT") });
  const schedule = useSelector((state) => state.schedule.schedule);
  const dateRef = useRef("");
  const [showPicker, setShowPicker] = useState(false);
  const [timePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  let [timeStartList, setTimeStartList] = useState(
    [
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

  const onChangeDate = ({ type }, selectedDate) => {
    if (type === "set") {
      // Adjust the selected date to Philippine time zone
      const adjustedDate = new Date(selectedDate);
      const offset = 480; // Offset in minutes for UTC+8 (Philippine time zone)
      adjustedDate.setMinutes(adjustedDate.getMinutes() + offset);

      setAppointmentDetails({
        ...appointmentDetails,
        date: adjustedDate,
      });

      const formattedDate = moment(adjustedDate).format("LL");
      dateRef.current = formattedDate;
      setShowTimePicker(true);

      if (Platform.OS === "android") {
        toggleDatepicker();
        setAppointmentDetails({
          ...appointmentDetails,
          date: adjustedDate,
        });
        dateRef.current = formattedDate;
        setShowTimePicker(true);
      }
    } else {
      toggleDatepicker();
    }
  };

  const onChangeText = (name, text) => {
    setAppointmentDetails({
      ...appointmentDetails,
      [name]: text
    })
  }

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

    setTimeStartList(newTimeList);

    setTimeStartList((prev) => {
      let updatedSchedList = [...prev];
      const filteredSchedule = schedule.filter((val) => moment(appointmentDetails.date, "YYYY-MM-DD").startOf('day').isSame(moment(schedule[0].dateSchedule, "YYYY-MM-DD").startOf('day')) && val.dentist.dentistId === appointmentDetails.dentist);

      if (filteredSchedule.length > 0) {
        const indicesScheduleToRemain = [];
        for (let x = 0; x < filteredSchedule.length; x++) {
          let start = timeStartList.findIndex((val) => val.timeStart === filteredSchedule[x].timeStart);
          let end = timeStartList.findIndex((val) => val.timeStart === filteredSchedule[x].timeEnd);

          for (let i = start; i <= end; i++) {
            indicesScheduleToRemain.push(i);
          }
        }

        updatedSchedList = updatedSchedList.filter((_, idx) => { return indicesScheduleToRemain.includes(idx) });

      }
      return updatedSchedList;
    });

    const filteredTime = newTimeList.filter((val) =>
      moment(appointmentDetails.date, 'YYYY-MM-DD').isSame(moment(), 'day') &&
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
          return moment(val.appointmentDate).format('LL') === moment(appointmentDetails.date).format('LL');
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
          for (let begin = start; begin <= end; begin++) {
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


  const timeSelectedButton = (value) => {
    if (!appointmentDetails.date || !selectedTime) return ToastFunction("error", "Please select a date and time");

    const end = calculateTotalTime(value);
    const totalTimeDuration = moment('00:00:00', 'HH:mm:ss');
    let start = moment(value, "HH:mm:ss");

    const filteredAppointment = appointment.filter((val) => {
      return (val.status !== "DONE" && val.status !== "CANCELLED")
        && moment(val.appointmentDate).isSame(moment(appointmentDetails.date), "day")
        && val.patient.patientId === appointmentDetails.patient;
    });

    console.log(filteredAppointment.length);
    if (filteredAppointment.length > 0) {
      return ToastFunction("error", "You have an existing appointment on this date")
    }

    while (start.isBefore(moment(end, "HH:mm:ss").add(30, 'minutes'))) {
      const startTime = start.format('HH:mm:ss');
      const matchingTime = timeStartList.find(time => time.timeStart === startTime);

      if (startTime === "12:30:00" || startTime === "16:30:00") {
        ToastFunction("error", `Kindly select ${totalTimeDuration.format('HH:mm:ss') === "01:00:00"
          ? '30 minutes'
          : 'less than 1 hour'
          } service or change other dates`);
        return;
      }

      if (!matchingTime) {
        if (appointmentDetails.totalServiceTime !== totalTimeDuration.format("HH:mm:ss")) {
          ToastFunction('error', `Please select time range ${totalTimeDuration.format('HH:mm:ss') === "00:30:00"
            ? 'equal to ' + totalTimeDuration.minute() + ' minutes'
            : 'less than or equal to ' + totalTimeDuration.hour() + ' hour'
            }`)
          return;
        }
      }

      totalTimeDuration.add(30, 'minutes');
      start.add(30, "minutes");
    }

    setAppointmentDetails({
      ...appointmentDetails,
      timeStart: value,
      timeEnd: end,
      timeSubmitted: moment().format("HH:mm:ss")
    })

    if (appointmentDetails.totalAmount == 0) {
      setAppointmentDetails({
        ...appointmentDetails,
        type: "free",
        method: "free",
        timeStart: value,
        timeEnd: end,
        timeSubmitted: moment().format("HH:mm:ss")
      })
      navigation.navigate("Review");
    }
    else {
      navigation.navigate("Payment");
    }
  }

  const calculateTotalTime = (value) => {
    const timeStart = moment(value, "HH:mm:ss");
    return timeStart.add(30, "minutes").format("HH:mm:ss");
  }

  const currentDate = moment();
  currentDate.add(1, 'day'); // Subtract one day

  useEffect(() => {
    checkAllAppointment();
  }, [dateRef.current]);

  return (
    <>
      <Toast />
      <SafeAreaView style={{ ...styles.containerGray, position: 'relative', zIndex: -50, padding: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: '500', color: "#3f3f46", marginRight: "auto" }}>Select your appointment schedule</Text>

        <View style={{ paddingVertical: 10, width: "100%" }}>
          {
            showPicker && (
              <DateTimePicker
                mode="date"
                display='spinner'
                value={appointmentDetails.date}
                onChange={onChangeDate}
                maximumDate={moment().endOf('year').toDate()}
                minimumDate={currentDate.toDate()} // Set the minimumDate to the previous day
                androidMode="calendar"
                {...(Platform.OS === 'ios' && { datePickerModeAndroid: 'spinner' })}
                {...(Platform.OS === 'ios' && { maximumDate: moment().endOf('year').toDate() })}
                {...(Platform.OS === 'android' && { minDate: moment().startOf('month').toDate() })}
                {...(Platform.OS === 'android' && { maxDate: moment().endOf('year').toDate() })}
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
                <InputText onChangeText={onChangeText} value={dateRef.current} placeholder={"Select Appointment Date"} isEditable={false} />
              </Pressable>
            )
          }
        </View>

        <View style={{ width: "100%", height: 500, position: 'absolute', bottom: timePicker ? 0 : -600, borderRadius: 8, gap: 40 }}>

          <View style={{ flexDirection: "column", gap: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: "#3f3f46" }}>Morning Slots</Text>
            <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: "center" }}>
              {
                timeStartList
                  .filter(item => {
                    const startTime = moment(item.timeStart, 'HH:mm:ss');
                    const startTimeRange = moment(timeStartList.indexOf(0), 'HH:mm:ss');
                    const endTimeRange = moment('12:00:00', 'HH:mm:ss');

                    return startTime.isSameOrAfter(startTimeRange) && startTime.isBefore(endTimeRange);
                  })
                  .map((val, idx) => (
                    <Pressable onPress={() => {
                      setSelectedTime(val.timeStart)
                    }} key={idx} style={{ borderWidth: 1.2, borderColor: selectedTime === val.timeStart ? '#06b6d4' : '#ccc', paddingHorizontal: 22, paddingVertical: 10, borderRadius: 4 }}>
                      <Text style={{ color: selectedTime === val.timeStart ? '#06b6d4' : '#2b2b2b', fontWeight: "500" }}>{val.timeValue}</Text>
                    </Pressable>
                  ))
              }
            </View>
          </View>

          <View style={{ flexDirection: "column", gap: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: "#3f3f46" }}>Morning Slots</Text>
            <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: "center" }}>
              {
                timeStartList
                  .filter(item => {
                    const startTime = moment(item.timeStart, 'HH:mm:ss');
                    const startTimeRange = moment('13:00:00', 'HH:mm:ss');
                    const endTimeRange = moment('16:00:00', 'HH:mm:ss');

                    return startTime.isSameOrAfter(startTimeRange) && startTime.isBefore(endTimeRange);
                  })
                  .map((val, idx) => (
                    <Pressable onPress={() => {
                      setSelectedTime(val.timeStart)
                    }} key={idx} style={{ borderWidth: 1.2, borderColor: selectedTime === val.timeStart ? '#06b6d4' : '#ccc', paddingHorizontal: 22, paddingVertical: 10, borderRadius: 4 }}>
                      <Text style={{ color: selectedTime === val.timeStart ? '#06b6d4' : '#2b2b2b', fontWeight: "500" }}>{val.timeValue}</Text>
                    </Pressable>
                  ))
              }
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View style={{ width: '100%', padding: 20, position: 'relative' }}>
        <Button title='Continue' bgColor='#06b6d4' textColor='#fff' onPress={() => timeSelectedButton(selectedTime)} />
      </View>
    </>
  );
};

export default React.memo(Schedule);