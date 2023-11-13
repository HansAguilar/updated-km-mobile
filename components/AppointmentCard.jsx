import React, { useState } from 'react';
import { View, Image, TouchableHighlight, Text, Dimensions } from 'react-native';
import moment from 'moment/moment';
import { styles } from '../style/styles';
function AppointmentCard({ title, dataList, type, bgColor, borderColor, subColor, fontColor, showDate, viewEvent, setModal, modal, navigate, update, setUpdateSchedule }) {

  function select(date) {
    // moment(val.appointmentDate).subtract(1, 'day').format("LL") === moment().format("LL")
    const val = moment(date).subtract(1, 'day').format("LL");
    console.log(moment(date).subtract(1, 'day').format("LL") === moment().format("LL"));
  }

  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, width: '100%' }}>
      <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#3f3f46', marginBottom: 3 }}>{title}</Text>
      {
        dataList && dataList.length > 0 ? (
          <>
            {
              dataList.map((val, idx) => (
                <View style={{ backgroundColor: bgColor, width: '100%', paddingVertical: 0, paddingHorizontal: 9, borderLeftColor: borderColor, borderLeftWidth: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', columnGap: 1, ...styles.shadow }} key={idx}>
                  <Image source={{ uri: val.dentist.profile }} style={{ width: 50, height: 50, borderRadius: 40 }} />
                  <View style={{ flex: 1, padding: 8, rowGap: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#27272a' }}>Dr. {val.dentist.fullname}</Text>
                    {showDate && <Text style={{ fontSize: 11, color: '#27272a' }}>{moment(val.appointmentDate).format('dddd, MMMM D YYYY')}</Text>}
                    <Text style={{ fontSize: 10, color: subColor }}>{moment(val.timeStart, 'HH:mm:ss').format('h:mm A')} - {moment(val.timeEnd, 'HH:mm:ss').format('h:mm: A')}</Text>

                  </View>
                  <View style={cardStyles.buttonContainer}>
                    <TouchableHighlight style={cardStyles.buttonView} onPress={() => viewEvent(val.appointmentId)}>
                      <Text style={cardStyles.buttonText}>View</Text>
                    </TouchableHighlight>
                    {val.typeAppointment === "upcoming" && (
                      <TouchableHighlight style={cardStyles.button} onPress={() =>
                        setUpdateSchedule({ ...update, data: val, isShow: true })
                      }>
                        <Text style={cardStyles.buttonText}>Update</Text>
                      </TouchableHighlight>
                    )}
                    {moment().format("LL") !== moment(val.appointmentDate).format("LL") && moment(val.appointmentDate).subtract(1, 'day').format("LL") !== moment().format("LL") && (val.status !== "TREATMENT") && (
                      <TouchableHighlight style={cardStyles.cancelButton} onPress={() =>
                        setModal({ ...modal, id: val.appointmentId, isShow: true })
                      }>
                        <Text style={cardStyles.buttonText}>Delete</Text>
                      </TouchableHighlight>
                    )}
                  </View>


                </View>
              ))
            }
          </>
        ) : <View style={{ width: '100%', padding: 15, }}>
          <Text style={{ color: '#a1a1aa', fontSize: 12, fontWeight: 'bold' }}>No Appointment</Text>
        </View>
      }
      {/* 
              NO APPOINTMENT
              <View style={{backgroundColor:'#06b6d4', width:'100%', padding:15, borderRadius:5, borderLeftColor:'#082f49', borderLeftWidth:2}}>
                <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>No Appointment</Text>
              </View> */}
    </View>
  )
}

export default AppointmentCard

const cardStyles = {
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  button: {
    width: 100, // Set a fixed width for the buttons
    backgroundColor: '#0284c7',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5, // Add marginVertical for spacing between buttons
  },
  buttonView: {
    width: 100, // Set a fixed width for the buttons
    backgroundColor: 'gray',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5, // Add marginVertical for spacing between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center', // Center the text within the button
  },
  cancelButton: {
    width: 100, // Set a fixed width for the buttons
    backgroundColor: "#ef4444",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5, // Add marginVertical for spacing between buttons
  },
};

