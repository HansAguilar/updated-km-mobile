import React, { useState } from "react";
import { View, ScrollView, Text, StyleSheet,Dimensions,Pressable,TouchableHighlight } from 'react-native';
import { useSelector } from "react-redux";
import NotificationModal from "../../components/NotificationModal";

const NotificationRoom = () =>{
    const { height, width } = Dimensions.get("screen");
    const notification = useSelector((state)=>state.notification.notification);
    const [readNotification, setReadNotification] = useState({
        id:null,
        isShow:false
    });
    

    return (
        <View>
        { readNotification.isShow && <NotificationModal notification={readNotification} setNotificationData={setReadNotification} /> }
        <ScrollView style={{height:"100%", maxHeight:height, width:width, maxWidth:width, paddingHorizontal:20, paddingVertical:10,zIndex:1}}>
            {
                notification && notification.map((val,idx)=>(
                    <Pressable key={idx} style={{width:"100%", paddingVertical:10, backgroundColor:"#fff", paddingHorizontal:15,paddingVertical:15,marginBottom:15,borderRadius:10}} onPress={()=>setReadNotification({...readNotification, id:val.notificationId, isShow:true})}>
                            <View style={{width:"100%", display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                                <Text style={{fontSize:16, fontWeight:"bold"}}>{val.name}</Text>
                               { val.status === "UNREAD" &&  <View style={{width:10, height:10, borderRadius:50, backgroundColor:"red"}}></View>} 
                            </View>
                            <View>
                                <Text style={{fontSize:12,marginTop:5}}>{val.description}</Text>
                            </View>
                    </Pressable>
                ))
            }
        </ScrollView>
        </View>
    )
}

export default React.memo(NotificationRoom);