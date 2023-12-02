import React from 'react';
import { View, Text, Dimensions, Image, SafeAreaView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import moment, { duration } from 'moment';
import { useSelector } from 'react-redux';
import logo from "../../assets/images/kmlogo.jpg";

const { height, width } = Dimensions.get('screen');

const AppointmentDetails = React.memo(({ navigation, appointmentId }) => {
  const { appointment } = useSelector((state) => { return state.appointment });

  const details = appointment.find((val) => val.appointmentId === appointmentId);
  const timeDuration = moment.duration(moment(details?.timeEnd, "HH:mm:ss").diff(moment(details?.timeStart, "HH:mm:ss")));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2", alignItems: "center", justifyContent: "center" }}>

      {/* //~ QR CODE WRAPPER */}
      <View style={style.QRcodeContainer}>

        {/* //~ KM LOGO */}
        <View style={{ alignItems: 'center' }}>
          <Image style={style.logoStyle} source={logo} />
        </View>
        {/* //~ KM LOGO */}


        {/* //~ QR DETAILS CONTAINER */}
        <View style={{ flexDirection: 'column', gap: 8 }}>

          {/* //~ QR CODE */}
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <QRCode value={appointmentId} size={200} />
          </View>
          {/* //~ QR CODE */}


          {/* //~ PATIENT INFO */}
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: "500", letterSpacing: 0.1, color: "#06b6d4" }}>{details.patient.firstname} {details.patient.lastname}</Text>
            <Text style={{ fontSize: 13, fontWeight: "400", color: "#bfbfbf" }}>New Patient</Text>
          </View>
          {/* //~ PATIENT INFO */}


          {/* //~ DASHED STYLE */}
          <Text style={style.dashedStyle}></Text>
          {/* //~ DASHED STYLE */}


          {/* //~ QR CODE AND APPOINTMENT DETAILS CONTAINER*/}
          <View style={{ paddingHorizontal: 14, gap: 10, paddingBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>Appointment Information</Text>

            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: "#595959" }}>Dentist:</Text>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>Dr. {details.dentist.fullname}</Text>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: "#595959" }}>Appointment Date: </Text>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>{moment(details.appointmentDate).format("dddd, MMMM D, YYYY")}</Text>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: "#595959" }}>Appointment Time: </Text>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>{moment(details.timeStart, 'HH:mm:ss').format('h:mm A')} - {moment(details.timeEnd, 'HH:mm:ss').format('h:mm A')}</Text>
              </View>

              {/* <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: "#595959" }}>Service Duration: </Text>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>{timeDuration.asHours() > 0 ? `${timeDuration.hours()} hour ${timeDuration.asMinutes() === "0" ? `` : `and ${timeDuration.minutes()} minutes`}` : `${timeDuration.minutes()} minutes`}</Text>
              </View> */}

              {
                details.dentalServices.length > 0 ?
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Text style={{ fontSize: 14, color: "#595959" }}>Service(s):</Text>
                    <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
                      {
                        details.dentalServices.map((val, idx) => (
                          <View style={{ flexDirection: "row" }} key={idx}>
                            <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>{val.name}</Text>
                            <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>({val.type})</Text>
                          </View>
                        ))
                      }
                    </View>
                  </View>
                  : <Text>For Dentist Viewing</Text>
              }

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 13, color: "#595959" }}>Payment: </Text>
                <Text style={{ fontSize: 13, fontWeight: "500", color: "#3f3f3f" }}>{details.status}</Text>
              </View>

            </View>
          </View>
          {/* //~ QR CODE AND APPOINTMENT DETAILS CONTAINER*/}


        </View>
        {/* //~ QR DETAILS CONTAINER */}

      </View>
      {/* //~ QR CODE WRAPPER */}

      <View style={{ marginTop: 20 }}>
        <Text style={{ color: '#bfbfbf', fontSize: 13 }}>Please present this QR Code when arriving at the clinic.</Text>
      </View>
    </SafeAreaView>
  )
})

export default AppointmentDetails;

const style = {
  logoStyle: {
    width: 80, height: 80,
    resizeMode: 'contain', aspectRatio: 1,
    borderRadius: 50, borderWidth: 1, borderColor: "#e6e6e6",
    position: "absolute", top: -40,
  },

  QRcodeContainer: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 10, borderWidth: 1, borderColor: "#e6e6e6",
    elevation: 1, shadowRadius: 10, shadowOpacity: 0.4,
    width: width - 40
  },

  dashedStyle: {
    height: 1, width: "100%",
    marginVertical: 10,
    borderWidth: 1, borderStyle: "dashed", borderColor: "#e6e6e6"
  }
}