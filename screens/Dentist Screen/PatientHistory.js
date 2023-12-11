import React from 'react';
import { View, Text, Image, Dimensions, Pressable } from 'react-native';
import { styles } from "../../style/styles";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { dentistFetchPayment, } from '../../redux/action/PaymentAction';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { useRef } from 'react';

const SkeletonLoading = () => {
  return (
    <View style={style.skeletonContainer}>
      <View style={style.skeletonSpecialty} />
      <View style={style.skeletonSpecialty} />
      <View style={style.skeletonSpecialty} />
      <View style={style.skeletonSpecialty} />
    </View>
  );
};


function History({ route }) {
  const { height, width } = Dimensions.get("screen");
  const dispatch = useDispatch();
  const { patientId } = route.params;
  const payment = useSelector((state) => state?.payment?.payment);

  useEffect(() => {
    dispatch(dentistFetchPayment(patientId));
  }, [patientId]);


  return (
    <ScrollView style={{ ...styles.containerGray, maxHeight: height, width: width, position: 'relative', padding: 20, marginBottom: 40 }}>
      {
        !payment &&
        <View style={{ flexDirection: 'column', height: 350, gap: 10 }}>
          <SkeletonLoading />
          <SkeletonLoading />
          <SkeletonLoading />
        </View>
      }
      {
        payment && (
          payment?.map((val, idx) => (
            <View key={idx} style={{ width: "100%", marginBottom: 10, }}>

              <View style={{ backgroundColor: "#fff", padding: 10, flexDirection: "column", gap: 12, elevation: 1 }}>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "400", color: "#595959" }}>Date</Text>
                    <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>{moment(val.appointment.appointmentDate).format("MMM DD, YYYY")}</Text>
                  </View>

                  <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "400", color: "#595959" }}>Time</Text>
                    <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>{moment(val.appointment.timeStart, 'HH:mm:ss').format('h:mm A')} - {moment(val.appointment.timeEnd, 'HH:mm:ss').format('h:mm A')}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "400", color: "#595959" }}>Dentist</Text>
                    <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>Dr. {val.appointment.dentist.fullname}</Text>
                  </View>

                  <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "400", color: "#595959" }}>Services</Text>
                    <View style={{ flexDirection: 'column', columnGap: 10 }}>
                      {
                        val.appointment.dentalServices.map((v, idx) => (
                          <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }} key={idx}>{v.name.trim()}</Text>
                        ))
                      }
                    </View>
                  </View>
                </View>

                <View style={{ borderBottomColor: "#ccc", borderBottomWidth: 1, borderStyle: "dashed", height: 6, width: "100%" }}></View>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "400", color: "#595959" }}>Amount Charge:</Text>
                    <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>Php. {val.amountCharge.toLocaleString()}</Text>
                  </View>

                  <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "400", color: "#595959" }}>Balance:</Text>
                    <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>Php. {val.balance.toLocaleString()}</Text>
                  </View>
                </View>

                <Text style={{backgroundColor:val.appointment.status==="DONE" || val.appointment.status==="TREATMENT_DONE" ? "#2dd4bf" : "#fb923c", paddingVertical:6, textAlign:'center', color:"white", textTransform:'capitalize'}}>{val.appointment.status === "TREATMENT_DONE" ? "Done" : val.appointment.status === "TREATMENT" ? "UNDER TREATMENT" :  val.appointment.status }</Text>
              </View>
            </View>
          ))
        )
      }
    </ScrollView>
  )
}

export default History;

const style = {
  skeletonContainer: {
    borderWidth: 1.2,
    borderColor: '#f2f2f2',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    elevation: 1,
    shadowRadius: 8,
    shadowOffset: .2,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 10,
    gap: 6
  },
  skeletonInfo: {
    width: '80%',
    height: 40,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
  },
  skeletonSpecialty: {
    width: '80%',
    height: 15,
    backgroundColor: '#f2f2f2',
  },
}