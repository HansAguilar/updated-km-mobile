import React from "react";
import { View, ScrollView, Text, StyleSheet,Dimensions,Pressable } from 'react-native';
import { useSelector } from "react-redux";

const NotificationRoom = () =>{
    const { height, width } = Dimensions.get("screen");
    const notification = useSelector((state)=>state.notification.notification);
    return notification && (
        <ScrollView style={{height:height, maxHeight:height, width:width, maxWidth:width, paddingHorizontal:20, paddingVertical:10}}>
            {
                notification.length > 0 && notification.map((val,idx)=>(
                    <Pressable key={idx} style={{width:"100%", paddingVertical:10, backgroundColor:"#fff", paddingHorizontal:15,paddingVertical:15,marginBottom:15,borderRadius:10}}>
                        <View style={{width:"100%", display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                            <Text style={{fontSize:16, fontWeight:"bold"}}>{val.name}</Text>
                            <View style={{width:10, height:10, borderRadius:50, backgroundColor:"red"}}></View>
                        </View>
                        <Text style={{fontSize:12,marginTop:5}}>{val.description}</Text>
                    </Pressable>
                ))
            }
        </ScrollView>
    )
}

export default React.memo(NotificationRoom);