import {View, Pressable, Text, ScrollView,TouchableHighlight,Dimensions,Image,Alert} from 'react-native';
import { styles } from '../../style/styles';
import Title from '../../components/Title';
import { useDispatch, useSelector } from 'react-redux';
import AntIcon from "react-native-vector-icons/AntDesign";
import React,{ useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import gcashLogo from '../../assets/images/gcashlogo.png';
import paymayaLogo from '../../assets/images/paymayalogo.png';
import { createPayment } from '../../redux/action/PaymentAction';
import { createNotification } from '../../redux/action/NotificationAction';
import ToastFunction from "../../config/toastConfig";
import * as io from "socket.io-client";
import { SOCKET_LINK } from '../../config/APIRoutes';

const socket = io.connect(SOCKET_LINK);
const Payment = ({navigation}) =>{
    const dispatch = useDispatch();
    const { height } = Dimensions.get("screen");
    const [page, setPage] = useState("cash")
    const { patient } = useSelector((state)=>{ return state.patient });
    const payment  = useSelector((state)=>{return state.payment.payment});
    
    // const { installment } = useSelector((state)=>{ return state.installment });
    const installment = payment.filter((val)=> val.type==="installment" && val.status==="PENDING").sort((a,b)=>moment(a.appointment.appointmentDate).isBefore((moment(b.appointment.appointmentDate? -1:1))))
    const [selectedPayment, setSelectedPayment] = useState({
        id:"",
        isActive: false,
        status:"",
        appointmentStatus:"",
        data: null
    });
    const [receipt, setReceipt] = useState("");
    const [paymentType, setPaymentType] = useState("");

    const handleImageUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.canceled) {
            return ToastFunction("error", "Kindly select an image");
          }
        
          const selectedAsset = result.assets[0];
          const base64Image = await convertAssetToBase64(selectedAsset);
          setReceipt(base64Image);
    }

    const convertAssetToBase64 = async (asset) => {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const handleSubmit = async() =>{
        if(!receipt) return Alert.alert("Fill up empty field");
        const data = { paymentPhoto: receipt, status:"PENDING",method:paymentType};
        await dispatch(createPayment(selectedPayment.id, data));
        const notificationData = {
            name: "Invoice for Patient Payment",
            time: moment().format("HH:mm:ss"),
            date: moment().format("YYYY-MM-DD"),
            patientId: selectedPayment.data.patient.patientId,
            description: `${selectedPayment.data.patient.firstname} ${selectedPayment.data.patient.lastname} ${selectedPayment.data.description ? 'update the receipt':`pay Php. ${selectedPayment.data.totalPayment}`}  for appointment ${moment(selectedPayment.data.appointment.appointmentDate).format("L").toString()===moment().format("L").toString() ? "today": "on"} ${moment(selectedPayment.data.appointment.appointmentDate).format("MMM DD YYYY")}`,
            receiverType: "ADMIN"
        }
        dispatch(createNotification(notificationData));
        const sendData = { value: selectedPayment.data.appointment.appointmentId };
        socket.emit("payment_client_changes", JSON.stringify(sendData));
        setSelectedPayment({...selectedPayment, id:"", isActive:false});
        setReceipt("");
      }

      
    const Modal = () =>{
        const [paymentToggle, setPaymentToggle] = useState(false);
        
        return(
            <View style={{height:height, width:"100%", backgroundColor:"rgba(0,0,0,0.4)",zIndex:500,position:'absolute',paddingHorizontal:20,display:"flex", justifyContent:'center',alignItems:"center"}}>
                <View style={{width:"100%",height:"auto", backgroundColor:"#fff",padding:20}}>
                    <View style={{width:"100%", borderBottomWidth:1,borderBottomColor:"#e4e4e7",paddingVertical:10}}>
                        <Text style={{fontSize:16, }}>Upload Your Receipt</Text>
                    </View>
                    <Text style={{color:"#ef4444",fontSize:11}}>Please ensure that the reference code is included in the screenshot provided.*</Text>

                    {
                        selectedPayment.appointmentStatus==="TREATMENT" ? (
                            <View style={{width:"100%"}}>
                                <Text style={{fontSize:10,fontWeight:"bold",color:"#3f3f46",marginBottom:5}}>Payment Type</Text>
                                
                                <Pressable
                                    style={{height:"auto",borderWidth:0.5,borderColor:"#e4e4e7",paddingVertical:8, paddingHorizontal:10,backgroundColor:"#fafafa",color:"#3f3f46",display:"flex", flexDirection:"row",justifyContent:'space-between', alignItems:'center'}}
                                    onPress={()=>setPaymentToggle(true)}
                                    >
                                <Text style={{fontSize:12,textTransform:'capitalize'}}>{paymentType ? paymentType:"Select payment type"}</Text>
                                <AntIcon name='down' size={12} color={"black"} />
                                </Pressable>

                                {paymentToggle && (
                                    <View style={{width:"100%",height:"auto",borderWidth:1, borderColor:"#e4e4e7"}}>
                                        <Text onPress={()=>{
                                                    setPaymentType("e-payment/gcash");
                                                    setPaymentToggle(false);
                                                }} 
                                                style={{width:"100%",paddingVertical:8, textAlign:'center',fontSize:12,textTransform:'capitalize'}}
                                                >
                                                    GCash
                                        </Text>
                                        <Text onPress={()=>{
                                                    setPaymentType("e-payment/paymaya");
                                                    setPaymentToggle(false);
                                                }} 
                                                style={{width:"100%",paddingVertical:8, textAlign:'center',fontSize:12,textTransform:'capitalize'}}
                                                >
                                                  Paymaya
                                        </Text>
                                        <Text onPress={()=>{
                                                    setPaymentType("cash");
                                                    setPaymentToggle(false);
                                                }} 
                                                style={{width:"100%",paddingVertical:8, textAlign:'center',fontSize:12,textTransform:'capitalize'}}
                                                >
                                                   Cash
                                        </Text>
                                    </View>
                                )}

                                {
                                    (paymentType && paymentType!=="cash") && (
                                        <>
                                            <View style={{paddingVertical:10,display:"flex",rowGap:5,justifyContent:'flex-start',alignItems:'flex-start', flexDirection:'row'}}>
                                    {
                                        paymentType === "e-payment/gcash" ? 
                                        // GCASH
                                        <View style={{display:"flex",flexDirection:'row',columnGap:3,alignItems:'center', backgroundColor:"#f4f4f5",paddingHorizontal:10,paddingVertical:5,borderRadius:10}}>
                                            <Image source={gcashLogo} style={{width:25,height:25,borderRadius:20}} />
                                            <Text style={{fontSize:12}}>091234567890</Text>
                                        </View>
                                        : <View style={{display:"flex",flexDirection:'row',columnGap:3,alignItems:'center', backgroundColor:"#f4f4f5",paddingHorizontal:10,paddingVertical:5,borderRadius:10}}>
                                                <Image source={paymayaLogo} style={{width:25,height:25,borderRadius:20}} />
                                                <Text style={{fontSize:12}}>091234567890</Text>
                                        </View>
                                    }
                                </View>
                                {
                                    receipt ? (
                                    <Image source={{uri:receipt}} style={{width:"100%", height:300}}/>) 
                                    : (
                                        <TouchableHighlight style={{backgroundColor:"#a5f3fc", width:"100%",padding:20, marginTop:15, borderRadius:10,...styles.shadow}} onPress={handleImageUpload}>
                                            <Text style={{color:"#083344", textAlign:"center"}}>Upload Receipt</Text>
                                        </TouchableHighlight>
                                )}
                                <View style={{width:"100%",paddingVertical:10,display:'flex',flexDirection:'row',justifyContent:'flex-end',columnGap:10,marginTop:10}}>
                                    <Text style={{width:120,paddingVertical:7, paddingHorizontal:20, borderWidth:1,borderColor:"#d4d4d8",textAlign:'center',borderRadius:20}} onPress={()=>{
                                        setSelectedPayment({
                                            ...selectedPayment,
                                            id: "",
                                            isActive:false
                                        });
                                        setReceipt("")
                                        }}>Cancel</Text>
                                    <Text style={{width:120,paddingVertical:7, paddingHorizontal:20, color:"#fff",backgroundColor:"#06b6d4",textAlign:'center',borderRadius:20}} onPress={handleSubmit}>Submit</Text>
                                </View>
                                        </>
                                    )
                                }

                            </View>
                        ):(
                        <>
                            <View style={{paddingVertical:10,display:"flex",rowGap:5,justifyContent:'flex-start',alignItems:'flex-start', flexDirection:'row'}}>
                                {
                                    paymentType === "e-payment/gcash" ? (
                                        <View style={{display:"flex",flexDirection:'row',columnGap:3,alignItems:'center', backgroundColor:"#f4f4f5",paddingHorizontal:10,paddingVertical:5,borderRadius:10}}>
                                            <Image source={gcashLogo} style={{width:25,height:25,borderRadius:20}} />
                                            <Text style={{fontSize:12}}>091234567890</Text>
                                        </View>
                                    )
                                    : (
                                    <View style={{display:"flex",flexDirection:'row',columnGap:3,alignItems:'center', backgroundColor:"#f4f4f5",paddingHorizontal:10,paddingVertical:5,borderRadius:10}}>
                                        <Image source={paymayaLogo} style={{width:25,height:25,borderRadius:20}} />
                                        <Text style={{fontSize:12}}>091234567890</Text>
                                    </View>
                                    )
                                }
                            </View>
                            {
                                receipt ? (
                                <Image source={{uri:receipt}} style={{width:"100%", height:300}}/>
                                ) : (
                                <TouchableHighlight style={{backgroundColor:"#a5f3fc", width:"100%",padding:20, marginTop:15, borderRadius:10,...styles.shadow}} onPress={handleImageUpload}>
                                    <Text style={{color:"#083344", textAlign:"center"}}>Upload Receipt</Text>
                                </TouchableHighlight>
                                )
                            }
                            <View style={{width:"100%",paddingVertical:10,display:'flex',flexDirection:'row',justifyContent:'flex-end',columnGap:10,marginTop:10}}>
                                <Text style={{width:120,paddingVertical:7, paddingHorizontal:20, borderWidth:1,borderColor:"#d4d4d8",textAlign:'center',borderRadius:20}} onPress={()=>{
                                    setSelectedPayment({
                                        ...selectedPayment,
                                        id: "",
                                        isActive:false
                                    });
                                    setReceipt("")
                                }}>Cancel</Text>
                                <Text style={{width:120,paddingVertical:7, paddingHorizontal:20, color:"#fff",backgroundColor:"#06b6d4",textAlign:'center',borderRadius:20}} onPress={handleSubmit}>Submit</Text>
                            </View>
                        </>)
                    }

                    {/*  */}
                </View>
            </View>
        )
    }

    const totalAmount = installment.reduce((acc,val)=>{ return acc+=val.totalPayment; },0);
    const totalPayment = installment.filter((val)=>val.status==="APPROVED").reduce((acc,val)=>{ return acc+=val.totalPayment; },0);
    
    return (
       <>
        { selectedPayment.isActive && <Modal />}
         <View style={{...styles.containerGray,position:'relative'}}>
            <Title title={"Payment"} />
            <View style={{width:"100%", paddingVertical:10,display:"flex", flexDirection:'row',justifyContent:'center',alignItems:"center",columnGap:10}}>
                <TouchableHighlight style={{ width:100,paddingVertical:7, backgroundColor:page==="cash"?"#0891b2":"#f4f4f5",borderRadius:20}} onPress={()=>setPage("cash")}><Text style={{color:page==="cash"?"#fff":"#27272a", textAlign:'center'}}>Cash</Text></TouchableHighlight>
                <TouchableHighlight style={{width:100,paddingVertical:7, backgroundColor:page==="installment"?"#0891b2":"#f4f4f5",borderRadius:20}} onPress={()=>setPage("installment")}><Text style={{color:page==="installment"?"#fff":"#27272a",textAlign:'center'}}>Installment</Text></TouchableHighlight>
            </View>
            {
                page==="installment" ? (
                    <ScrollView style={{width:"100%",height:100, paddingHorizontal:20, marginBottom:20}}>
                        <View style={{width:"100%", backgroundColor:"#0891b2", paddingVertical:15, paddingHorizontal:8, display:'flex', flexDirection:'row',justifyContent:'space-between',borderRadius:10}}>
                            <Text style={{color:"#fff",fontWeight:'bold',fontSize:16}}>Remaining Balance:</Text>
                            <Text style={{color:"#fff",fontSize:16}}>₱ {Math.ceil(totalAmount-totalPayment).toLocaleString()}</Text>
                        </View>
                        <View style={{width:"100%",height:"auto", paddingHorizontal:10,paddingVertical:15,backgroundColor:"#fff",marginTop:10,borderRadius:10,display:'flex',flexDirection:'column'}}>
                           <Text style={{width:"100%", borderBottomWidth:1,borderBottomColor:"#0891b2",fontSize:16,paddingBottom:10,fontWeight:'bold',color:"#52525b"}}>Payment Schedule</Text>
                           <View style={{marginTop:10,flex:1, rowGap:10,paddingHorizontal:15}}>
                           {
                            installment.map((val,idx)=>(
                                <View key={idx} style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text style={{fontSize:12}}>{moment(val.appointment.appointmentDate).format("ddd DD MMM,YYYY")}</Text>
                                    <Text style={{fontSize:12}}>₱{Math.ceil(val.totalPayment).toLocaleString()}</Text>
                                    <Text style={{fontSize:11, 
                                    textTransform:'capitalize',
                                    borderRadius:20,
                                    color:"#fff",
                                    paddingHorizontal:12,
                                    paddingVertical:2,
                                        backgroundColor: val.status==="PENDING" ? "#fb923c"
                                        : val.status==="CHECKING" ? "#fbbf24"
                                        : val.status==="APPROVED" ? "#14b8a6"
                                        : "#ef4444"
                                        ,
                                        }}>{val.status}</Text>
                                    {/* <Text style={{fontSize:12, textDecorationLine:'underline',color:"#06b6d4"}}>Pay</Text> */}
                                </View>
                            ))
                           }
                           </View>
                           <View style={{width:"100%", paddingHorizontal:20, paddingVertical:15, display:'flex', justifyContent:'space-between', alignItems:'center', flexDirection:'row', borderTopWidth:1, marginTop:10}}>
                                <Text>Total Amount:</Text>
                                <Text>Php. {totalAmount.toLocaleString()}</Text>
                           </View>

                        </View>
                    </ScrollView>
                ):(
                    <ScrollView style={{width:"100%", paddingHorizontal:20,paddingBottom:20}}>
                        {
                            payment.length > 0?
                            payment
                            .filter((val)=>{
                                return val.method !== "cash" && (val.status === "PENDING" || val.status === "CHECKING");
                            })
                            .sort((a,b)=>{
                                return moment(a.appointment.appointmentDate).isAfter(b.appointment.appointmentDate)?1:-1;
                            })
                            .map((val)=>(
                                <React.Fragment key={val.paymentId}>
                                    <View style={{width:"100%",padding:15, backgroundColor:"#fff", marginTop:10 ,borderRadius:5 ,...styles.shadow}}>
                                        <View style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:'space-between',alignItems:'center'}}>
                                            <Text style={{fontSize:14, fontWeight:'bold',color:"#71717a"}}>{moment(val.appointment.appointmentDate).format("dddd, MMMM D YYYY")}</Text>

                                            {
                                            ((val.method!=="cash" && val.method!=="hmo") && val.status === "PENDING") 
                                            && val.appointment.status !== "PENDING"
                                            && (<Text style={{color:"#0891b2",fontSize:12,textDecorationLine:'underline'}} onPress={()=>{
                                                setSelectedPayment({
                                                    ...selectedPayment,
                                                    id: val.paymentId,
                                                    isActive:true,
                                                    appointmentStatus: val.appointment.status,
                                                    data: val
                                                })
                                                setPaymentType(val.method);
                                            }}
                                            >Pay Bill</Text>)}

                                        </View>
                                        <View style={{width:"100%",display:'flex',justifyContent:'flex-start',alignItems:'flex-start',flexDirection:'row',columnGap:2}}>
                                            <Text style={{fontSize:11,textTransform:'capitalize',}}>{val.method} </Text>
                                            <View style={{paddingHorizontal:15,paddingVertical:1,backgroundColor:"#fb923c",borderRadius:50}}><Text style={{color:"#fff",textTransform:'uppercase',fontSize:10,}}>{val.status}</Text></View>
                                        </View>
                                        <Text style={{fontSize:11,color:"#0891b2"}}>Amount: ₱{val.totalPayment.toLocaleString()}</Text>
                                        {
                                            val.description && (
                                                <View style={{width:"100%", padding:10, backgroundColor:"#fafaf9"}}>
                                                    <Text style={{fontWeight:'bold', color:"#ef4444",fontSize:11}}>Note*</Text>
                                                    <Text style={{fontSize:14,color:"#ef4444"}}>{val.description}</Text>
                                                </View>
                                            )
                                        }
                                    </View>
                                </React.Fragment>
                            ))
                            :<Text>No Payment</Text>
                        }
                    </ScrollView>
                )
            }
        </View>
       </>
    );
}

export default React.memo(Payment);