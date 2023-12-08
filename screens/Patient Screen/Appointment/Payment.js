import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { styles } from '../../../style/styles';
import gcashLogo from '../../../assets/images/gcashlogo.png';
import paymayaLogo from '../../../assets/images/paymayalogo.png';
import Button from '../../../components/Button';
import AntDesign from "react-native-vector-icons/AntDesign";

function Payment({ navigation, appointmentDetails, setAppointmentDetails }) {
  const [activeOptions, setActiveOption] = useState({ value: "", isActive: false });
  const [activeEpayment, setActiveEpayment] = useState(false);
  const paymentOption = [
    {
      name: "e-payment",
      options: [
        { value: "e-payment/gcash", name: "GCash", picture: gcashLogo },
        { value: "e-payment/paymaya", name: "Paymaya", picture: paymayaLogo },
      ],
    },
    {
      name: "cash",
      value: "cash",
    },
  ];

  const onChangeHandler = (type, value) => {
    setAppointmentDetails({ ...appointmentDetails, [type]: value });
    setActiveOption({ ...activeOptions, isActive: false });
  };

  return (
    <View style={{ ...styles.containerGray, position: 'relative', ...styles.shadow }}>

      <View style={{ padding: 20, flex: 1, flexDirection: 'column', gap: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: '500', color: "#3f3f46" }}>Please select your payment method</Text>


        {/*//~ Payment Type */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 12, fontWeight: "500", color: "#666666" }}>Payment Type:</Text>
          <Pressable style={{ ...style.dropdownStyle, borderColor: "#CCC", borderWidth: 1 }} onPress={() => setActiveOption({ ...activeOptions, value: "type", isActive: !activeOptions.isActive })}>
            <View style={{ padding: 14, justifyContent: "space-between", flexDirection: "row", width: "100%", alignItems: "center" }}>
              <Text style={{ fontSize: 14, textTransform: 'capitalize' }}>{appointmentDetails.type ? appointmentDetails.type : "Select payment type"}</Text>
              <AntDesign name={activeOptions.isActive ? "down" : "up"} color="#2b2b2b" />
            </View>

            {
              (activeOptions.value === "type" && activeOptions.isActive) && (
                <>
                  <Pressable style={{ ...style.subDropdownStyle, padding: 10 }}
                    onPress={() => {
                      onChangeHandler("type", "full-payment")
                      setActiveOption({ ...activeOptions, value: appointmentDetails.method ? "" : "method" })
                    }} >
                    <Text style={{ fontSize: 14, paddingHorizontal: 8, color: "#2b2b2b" }}>Full-Payment</Text>
                  </Pressable>
                  {
                    Number.parseInt(appointmentDetails.totalAmount) > 1000 && <Pressable
                      style={{ padding: 15, width: '100%', backgroundColor: '#fafafa', ...styles.shadow }}
                      onPress={() => {
                        onChangeHandler("type", "installment")
                        setActiveOption({ ...activeOptions, value: appointmentDetails.method ? "" : "months" })
                      }} >
                      <Text style={{ fontSize: 14 }}>Installment</Text>
                    </Pressable>
                  }
                </>
              )
            }
          </Pressable>
        </View>
        {/*//~ Payment Type */}


        {(activeOptions.value === "months" || appointmentDetails.numberOfMonths > 0) && (
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: "500", color: "#666666" }}>Number of months to pay:</Text>
            <Pressable style={{ ...style.dropdownStyle, borderColor: "#CCC", borderWidth: 1 }} onPress={() => setActiveOption({ ...activeOptions, value: "months", isActive: !activeOptions.isActive })}>
              <View style={{ padding: 14 }}>
                <Text style={{ fontSize: 12, textTransform: 'capitalize' }}>{appointmentDetails.numberOfMonths ? `${appointmentDetails.numberOfMonths} Months` : "Select months to pay"}</Text>
              </View>
              {(activeOptions.value === "months" && activeOptions.isActive) && (
                <>
                  <Pressable
                    style={{ padding: 15, width: '100%', backgroundColor: '#fafafa', ...styles.shadow }}
                    onPress={() => {
                      onChangeHandler("numberOfMonths", 3)
                      setActiveOption({ ...activeOptions, value: appointmentDetails.method ? "" : "method" })
                    }} >
                    <Text style={{ fontSize: 12 }}>3 Months</Text>
                  </Pressable>
                  <Pressable
                    style={{ padding: 15, width: '100%', backgroundColor: '#fafafa', ...styles.shadow }}
                    onPress={() => {
                      onChangeHandler("numberOfMonths", 6)
                      setActiveOption({ ...activeOptions, value: appointmentDetails.method ? "" : "method" })
                    }} >
                    <Text style={{ fontSize: 12 }}>6 Months</Text>
                  </Pressable>
                  <Pressable
                    style={{ padding: 15, width: '100%', backgroundColor: '#fafafa', ...styles.shadow }}
                    onPress={() => {
                      onChangeHandler("numberOfMonths", 12)
                      setActiveOption({ ...activeOptions, value: appointmentDetails.method ? "" : "method" })
                    }} >
                    <Text style={{ fontSize: 12 }}>12 Months</Text>
                  </Pressable>
                </>
              )}
            </Pressable>
          </View>
        )}


        {/*//~ Payment Method */}
        {(activeOptions.value === "method" || appointmentDetails.method) && (
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#666666" }}>Payment Method:</Text>
            <Pressable style={{ ...style.dropdownStyle, borderColor: "#CCC", borderWidth: 1 }} onPress={() => {
              setActiveOption({ ...activeOptions, value: "method", isActive: !activeOptions.isActive })
              setActiveEpayment((prev) => { return !prev })
            }}>
              <View style={{ padding: 14, justifyContent: "space-between", flexDirection: "row", width: "100%", alignItems: "center" }}>
                <Text style={{ fontSize: 14, textTransform: 'capitalize' }}>{appointmentDetails.method ? appointmentDetails.method : "Select payment method"}</Text>
                <AntDesign name={activeOptions.isActive ? "down" : "up"} color="#2b2b2b" />
              </View>

              {
                (activeOptions.value === "method" && activeOptions.isActive) && paymentOption.map((val, idx) => (
                  <React.Fragment key={idx}>
                    {
                      val.options ? (
                        <View style={{ width: '100%', height: 'auto' }}>
                          <Pressable style={{ ...style.subDropdownStyle }} onPress={() => setActiveEpayment(!activeEpayment)}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingHorizontal: 18, paddingVertical: 8, }}>
                              <Text style={{ fontSize: 14, color: "#2b2b2b" }}>{val.name}</Text>
                              <AntDesign name={activeOptions.isActive ? "down" : "up"} color="#2b2b2b" />
                            </View>
                          </Pressable>

                          {
                            activeEpayment && val.options.map((option, optionIdx) => (
                              <Pressable key={optionIdx} style={{ ...style.subSubDropdown }} onPress={() => onChangeHandler("method", option.value)}>
                                <Image source={option.picture} style={{ width: 40, height: 40, borderRadius: 10 }} />
                                <Text style={{ fontSize: 14, fontWeight: '500', color: "#2b2b2b" }}>{option.name}</Text>
                              </Pressable>
                            ))
                          }
                        </View>
                      ) : (
                        <Pressable style={{ ...style.subDropdownStyle, padding: 10 }} onPress={() => onChangeHandler("method", "cash")}>
                          <Text style={{ fontSize: 14, paddingHorizontal: 8, color: "#2b2b2b" }}>{val.name}</Text>
                        </Pressable>
                      )
                    }
                  </React.Fragment>
                ))}

            </Pressable>
          </View>
        )}
        {/*//~ Payment Method */}
      </View>


      <View style={{ position: 'absolute', width: '100%', padding: 20, bottom: 0, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', rowGap: 20 }}>
        {/* <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
          <Text style={{ fontSize: 14, color: "#595959", fontWeight: "500" }}>Mode of payment:</Text>
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>{appointmentDetails.method}</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
          <Text style={{ fontSize: 14, color: "#595959", fontWeight: "500" }}>Payment Type:</Text>
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>{appointmentDetails.type}</Text>
        </View> */}
        <View style={{ borderBottomWidth: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8 , borderColor: "#CCC"}}>
          <Text style={{ fontSize: 16, color: "#595959", fontWeight: "500" }}>Total Amount</Text>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#3f3f3f" }}>₱ {appointmentDetails.totalAmount.toLocaleString()}</Text>
        </View>

        {appointmentDetails.method && (<Button
          title="Continue"
          bgColor="#06b6d4"
          textColor="#fff"
          onPress={() => { navigation.navigate("Review") }} />
        )}
      </View>
    </View >
  );
}

export default React.memo(Payment);


const style = {
  dropdownStyle: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#fff',
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    ...styles.shadow,
    overflow: 'hidden',
  },

  subDropdownStyle: {
    width: '100%',
    backgroundColor: "#f2f2f2", ...styles.shadow,
    justifyContent: "space-between",
    flexDirection: "row", width: "100%", alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#CCC"
  },

  subSubDropdown: {
    padding: 15, width: '100%', backgroundColor: '#fff',
    display: 'flex', flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10, ...styles.shadow,
    borderBottomWidth: 1,
    borderColor: "#CCC"
  }
}