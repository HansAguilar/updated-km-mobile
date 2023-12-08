import React from 'react';
import { View, Image, TouchableHighlight, Text, Pressable, SafeAreaView, } from 'react-native';
import moment from 'moment/moment';
import { styles } from '../style/styles';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

function AppointmentCard({ title, dataList, type, bgColor, borderColor, subColor, fontColor, showDate, viewEvent, setModal, modal, navigate, update, setUpdateSchedule, showPopUp, selectedItem, handleShowPopUp }) {
  function select(date) {
    // moment(val.appointmentDate).subtract(1, 'day').format("LL") === moment().format("LL")
    const val = moment(date).subtract(1, 'day').format("LL");
    // console.log(moment(date).subtract(1, 'day').format("LL") === moment().format("LL"));
  }

  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, width: '100%', paddingRight: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: '500', color: '#3f3f46' }}>{title}</Text>
      {
        dataList && dataList.length > 0 ? (
          <>
            {
              dataList.map((val, idx) => (
                <View style={{ paddingHorizontal: 8, gap: 8, paddingRight: 12, position: 'relative' }} key={idx}>


                  {/* //~ APPOINTMENT DATE */}
                  <View>
                    {showDate && <Text style={{ fontSize: 12, color: '#bfbfbf', fontWeight: "500" }}>{moment(val.appointmentDate).format('dddd, MMMM D YYYY')}</Text>}
                  </View>
                  {/* //~ APPOINTMENT DATE */}


                  <TouchableHighlight onPress={() => viewEvent(val.appointmentId)} style={{ borderRadius: 8 }}>
                    <View style={{ borderRadius: 6, backgroundColor: bgColor, width: '100%', padding: 10, borderColor: borderColor, borderWidth: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, ...styles.shadow }} >

                      {/* //~ IMAGE DENTIST */}
                      <Image source={{ uri: val.dentist.profile }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                      {/* //~ IMAGE DENTIST */}


                      {/* //~ DENTIST AND APPOINTMENT TIME */}
                      <View style={{ flex: 1, rowGap: 1 }}>
                        <Text style={{ fontWeight: '500', fontSize: 15, color: '#737373', letterSpacing: 0.2 }}>Dr. {val.dentist.fullname.charAt(0).toUpperCase() + val.dentist.fullname.substring(1)}</Text>
                        <Text style={{ fontSize: 13, color: subColor, fontWeight: "500" }}>{moment(val.timeStart, 'HH:mm:ss').format('h:mm A')} - {moment(val.timeEnd, 'HH:mm:ss').format('h:mm A')}</Text>
                      </View>
                      {/* //~ DENTIST AND APPOINTMENT TIME */}


                      {/* //~ THREE DOTS */}
                      <Pressable style={{ zIndex: 40 }} onPress={() => handleShowPopUp(idx)}>
                        <SimpleLineIcons name="options-vertical" size={20} color="#bfbfbf" />
                      </Pressable>
                      {/* //~ THREE DOTS */}


                      {/* //~ POP UP MENU */}
                      {
                        showPopUp && idx === selectedItem && (
                          <SafeAreaView style={{ backgroundColor: '#fff', flexDirection: 'column', position: 'relative', zIndex: 50, top: -65, right: 15, borderWidth: 1, borderColor: "#e6e6e6", borderRadius: 4, }}>
                            {val.typeAppointment === "upcoming" && (
                              <TouchableHighlight style={{ paddingHorizontal: 50, paddingVertical: 12, borderBottomColor: '#d9d9d9', borderBottomWidth: 1, }} onPress={() =>
                                setUpdateSchedule({ ...update, data: val, isShow: true })
                              }>
                                <Text style={{ ...cardStyles.buttonText, letterSpacing: 0.2 }}>Update</Text>
                              </TouchableHighlight>
                            )}
                            {moment().format("LL") !== moment(val.appointmentDate).format("LL") && moment(val.appointmentDate).subtract(1, 'day').format("LL") !== moment().format("LL") && (val.status !== "TREATMENT") && (
                              <TouchableHighlight style={{ paddingHorizontal: 50, paddingVertical: 12, }} onPress={() =>
                                setModal({ ...modal, id: val.appointmentId, isShow: true })
                              }>
                                <Text style={{ ...cardStyles.buttonText, color: '#ff6666' }}>Cancel</Text>
                              </TouchableHighlight>
                            )}
                          </SafeAreaView>
                        )
                      }
                      {/* //~ POP UP MENU */}


                      {/* <View style={cardStyles.buttonContainer}>
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
                      </View> */}
                    </View>
                  </TouchableHighlight>
                </View>
              ))
            }
          </>
        ) : <View style={{ width: '100%', padding: 15, }}>
          <Text style={{ color: '#a1a1aa', fontSize: 12, fontWeight: 'normal' }}>No appointments are currently scheduled for you</Text>
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
    color: '#666666',
    fontSize: 13,
    fontWeight: '500',
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

