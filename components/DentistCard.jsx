import React, { useState } from 'react';
import { View, Text,Image,Pressable } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { approvedAppointment } from "../redux/action/AppointmentAction";
import Octicons from "react-native-vector-icons/Octicons";
import { useDispatch } from 'react-redux';

function DentistCard({header, data,setModal,setTreatmentData}) {
    const [dropToggle, setDropToggle] = useState(false);
    const dispatch = useDispatch();
    // console.log(...data);
    return (
        <View style={{width:"100%",paddingVertical:15, paddingHorizontal:10, height:"auto"}}>
            
            <Text style={{fontSize:16, fontWeight:'bold', color:"#52525b"}}>{header}</Text>
            <View style={{width:"100%", height:300,}}>
                {
                    data.map((val,idx)=>(
                        <View key={idx} style={{width:"100%", backgroundColor:"white",height:"auto", padding:10, display:'flex', flexDirection:'row', columnGap:10, marginTop:10,}}>
                            <Image source={{uri:val.patient.profile}} style={{width:40, height:40, borderRadius:100}} />
                            {/* LEFT */}
                            <View style={{flex:1,justifyContent:'space-between', flexDirection:'row',}}>
                                <View>
                                    <Text style={{fontSize:14}}>{val.patient.firstname} {val.patient.lastname}</Text>
                                    <Text style={{fontSize:12,color:"#06b6d4", fontWeight:'bold',textTransform:'capitalize',textDecorationLine:'underline'}} onPress={()=>setDropToggle((prev)=>!prev)}>{val.status}</Text>
                                    
                                </View>
                               {
                                (val.status === "PROCESSING" || val.status === "TREATMENT_PROCESSING") && (
                                    <View style={{display:'flex',flexDirection:'row', gap:8}}>
                                    {/* {
                                        val.status === "PROCESSING" && (
                                            <> */}
                                            <Pressable style={{padding:10,backgroundColor:"#10b981",borderRadius:100}} onPress={()=>{
                                                setTreatmentData(val);
                                                setModal(true);
                                            }}>
                                                <Octicons name='checklist' size={20} color={"#fff"} />
                                            </Pressable>
                                            <Pressable style={{padding:10,backgroundColor:"#06b6d4",borderRadius:100}} onPress={()=>dispatch(approvedAppointment(val.appointmentId))}>
                                                <MaterialIcons name='done' size={20} color={"#fff"} />
                                            </Pressable>
                                            
                                            
                                            {/* <AntIcon name='down' size={20} onPress={()=>setDropToggle(!dropToggle)} /> */}
                                            {/* <Text style={{ backgroundColor:"#06b6d4",color:"white",paddingHorizontal:15, paddingVertical:3,borderRadius:100 }}>Treatment</Text>
                                            <Text style={{ backgroundColor:"#10b981",color:"white",paddingHorizontal:15, paddingVertical:3,borderRadius:100 }}>Done</Text> */}
                                            
                                            {/* </>
                                        )
                                    } */}
                                </View>
                                )
                               }
                            </View>
                        </View>
                    ))
                }
               {
                dropToggle && ( 
                <View style={{width:"100%"}}>
                    {
                        data[0].dentalServices.map((val,idx)=>(
                            <Text key={idx} style={{paddingHorizontal:20,paddingVertical:10,backgroundColor:"#06b6d4",color:"#fff",textAlign:'center'}}>{val.name}</Text>
                        ))
                    }
                </View>)
               }


            </View>
        </View>
    );
}

export default DentistCard;