import {View, Pressable, Text, ScrollView,TouchableHighlight,Dimensions,Image,Alert} from 'react-native';
import { styles } from '../../style/styles';
import Title from '../../components/Title';
import { useDispatch, useSelector } from 'react-redux';

import React,{ useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import gcashLogo from '../../assets/images/gcashlogo.png';
import paymayaLogo from '../../assets/images/paymayalogo.png';
import { createPayment } from '../../redux/action/PaymentAction';

const Payment = ({navigation}) =>{
    const dispatch = useDispatch();
    const { height } = Dimensions.get("screen");
    const [page, setPage] = useState("cash")
    const { loading, payment } = useSelector((state)=>{return state.payment});
    const { patient } = useSelector((state)=>{ return state.patient });
    const { installment } = useSelector((state)=>{ return state.installment });
    const [selectedPayment, setSelectedPayment] = useState({
        id:"",
        isActive: false,
    });
    const [receipt, setReceipt] = useState("");


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

      const handleSubmit = () =>{
        if(!receipt) return Alert.alert("Fill up empty field");
        const data = { paymentPhoto: receipt, status:"PENDING"}
        dispatch(createPayment(selectedPayment.id, data));
        setSelectedPayment({...selectedPayment, id:"", isActive:false});
        setReceipt("");
      }
    const Modal = () =>{
        return(
            <View style={{height:height, width:"100%", backgroundColor:"rgba(0,0,0,0.4)",zIndex:500,position:'absolute',paddingHorizontal:20,display:"flex", justifyContent:'center',alignItems:"center"}}>
                <View style={{width:"100%",height:"auto", backgroundColor:"#fff",padding:20}}>
                    <View style={{width:"100%", borderBottomWidth:1,borderBottomColor:"#e4e4e7",paddingVertical:10}}>
                        <Text style={{fontSize:16, }}>Upload Your Receipt</Text>
                    </View>
                    <Text style={{color:"#ef4444",fontSize:11}}>Please ensure that the reference code is included in the screenshot provided.*</Text>
                    <View style={{paddingVertical:10,display:"flex",rowGap:5,justifyContent:'flex-start',alignItems:'flex-start', flexDirection:'row'}}>
                        <View style={{display:"flex",flexDirection:'row',columnGap:3,alignItems:'center', backgroundColor:"#f4f4f5",paddingHorizontal:10,paddingVertical:5,borderRadius:10}}>
                            <Image source={gcashLogo} style={{width:25,height:25,borderRadius:20}} />
                            <Text style={{fontSize:12}}>091234567890</Text>
                        </View>
                        <View style={{display:"flex",flexDirection:'row',columnGap:3,alignItems:'center', backgroundColor:"#f4f4f5",paddingHorizontal:10,paddingVertical:5,borderRadius:10}}>
                            <Image source={paymayaLogo} style={{width:25,height:25,borderRadius:20}} />
                            <Text style={{fontSize:12}}>091234567890</Text>
                        </View>
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
                </View>
            </View>
        )
    }

    const totalAmount = installment?.reduce((acc,val)=>{ return acc+=val.installmentAmount; },0);
    return !loading && payment  &&installment&& (
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
                    <ScrollView style={{width:"100%",height:100, paddingHorizontal:20, }}>
                        <View style={{width:"100%", backgroundColor:"#0891b2", paddingVertical:15, paddingHorizontal:8, display:'flex', flexDirection:'row',justifyContent:'space-between',borderRadius:10}}>
                            <Text style={{color:"#fff",fontWeight:'bold',fontSize:16}}>Total Amount:</Text>
                            <Text style={{color:"#fff",fontSize:16}}>₱ {totalAmount.toLocaleString()}</Text>
                        </View>
                        <View style={{width:"100%",height:"auto", paddingHorizontal:10,paddingVertical:15,backgroundColor:"#fff",marginTop:10,borderRadius:10,display:'flex',flexDirection:'column'}}>
                           <Text style={{width:"100%", borderBottomWidth:1,borderBottomColor:"#0891b2",fontSize:16,paddingBottom:10,fontWeight:'bold',color:"#52525b"}}>Payment Schedule</Text>
                           <View style={{marginTop:10,flex:1, rowGap:10,paddingHorizontal:15}}>
                           {
                            installment.map((val,idx)=>(
                                <View key={idx} style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text style={{fontSize:12}}>{moment(val.dueDate).format("ddd DD MMM,YYYY")}</Text>
                                    <Text style={{fontSize:12}}>₱{val.installmentAmount.toLocaleString()}</Text>
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

                        </View>
                    </ScrollView>
                ):(
                    <ScrollView style={{width:"100%", paddingHorizontal:20,paddingBottom:20}}>
                        {
                            payment.length > 0?
                            payment
                            .filter((val)=>{
                                return val.type === "full-payment" && (val.status === "PENDING" || val.status === "FOR_APPROVAL");
                            })
                            .sort((a,b)=>{
                                return moment(a.appointment.appointmentDate).isAfter(b.appointment.appointmentDate)?1:-1;
                            })
                            .map((val)=>(
                                <React.Fragment key={val.paymentId}>
                                    <View style={{width:"100%",padding:15, backgroundColor:"#fff", marginTop:10 ,borderRadius:5 ,...styles.shadow}}>
                                        <View style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:'space-between',alignItems:'center'}}>
                                            <Text style={{fontSize:14, fontWeight:'bold',color:"#71717a"}}>{moment(val.appointment.appointmentDate).format("dddd, MMMM D YYYY")}</Text>

                                            {val.method!=="cash" && val.status === "PENDING" && (<Text style={{color:"#0891b2",fontSize:12,textDecorationLine:'underline'}} onPress={()=>
                                                setSelectedPayment({
                                                    ...selectedPayment,
                                                    id: val.paymentId,
                                                    isActive:true
                                                })
                                            }
                                            >Pay Bill</Text>)}

                                        </View>
                                        <View style={{width:"100%",display:'flex',justifyContent:'flex-start',alignItems:'flex-start',flexDirection:'row',columnGap:2}}>
                                            <Text style={{fontSize:11,textTransform:'capitalize',}}>{val.method} </Text>
                                            <View style={{paddingHorizontal:15,paddingVertical:1,backgroundColor:"#fb923c",borderRadius:50}}><Text style={{color:"#fff",textTransform:'uppercase',fontSize:10,}}>{val.status}</Text></View>
                                        </View>
                                        <Text style={{fontSize:11,color:"#0891b2"}}>Amount: ₱{val.totalPayment.toLocaleString()}</Text>
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