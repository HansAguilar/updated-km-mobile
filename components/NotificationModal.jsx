import React from "react";
import { useEffect } from "react";
import { View, ScrollView, Text, StyleSheet,Dimensions,Pressable } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { readPatientNotification } from "../redux/action/NotificationAction";
import { useState } from "react";

const NotificationBox = ({notification, setNotificationData}) =>{
    const { height, width } = Dimensions.get("screen");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const readFunction =()=>{
        dispatch(readPatientNotification(notification.id,setData));
    }
    useEffect(()=>{
        readFunction();
    },[])
    return data && (
        <View style={{height:height, width:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)", position:'absolute',zIndex:10,padding:20, display:'flex', justifyContent:'center', alignItems:'center'}}>
            <View style={{backgroundColor:"white", padding:10}}>
                <View style={{display:"flex", justifyContent:"space-between", flexDirection:"row"}}>
                    <Text style={{fontSize:18, borderBottomWidth:1,marginBottom:10}}>{data.name}</Text>
                    
                    {/* EXIT BUTTON */}
                    <Text style={{padding:10, borderRadius:20, backgroundColor:"red"}} onPress={()=>setNotificationData({...notification, isShow:false})}>X</Text>
                </View>
                <Text>{data.description}</Text>
            </View>
        </View>
    )
}

export default React.memo(NotificationBox);