import React, { useEffect, useRef, useState } from 'react';
import { View, Text,ScrollView,Dimensions,Image,FlatList,TextInput,Pressable,Keyboard } from "react-native";
import { createMessage } from "../../../redux/action/MessageAction";
import { styles } from '../../../style/styles';
import IonIcons from "react-native-vector-icons/Ionicons";
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { MessageBox } from "../../../components/MessageBox"

function MessageRoom({route,navigation}) {
    const { roomId } = route.params;
    const messageHistory = useSelector((state)=>{return state.messages.message[roomId]});
    const {height} = Dimensions.get("screen");
    const flatListRef = useRef();
    const [sentMessage, setSentMessage]=useState("");
    const dispatch = useDispatch();

    const scrollToBottom = () => {
        if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: false });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

      const renderItem = ({ item }) => <MessageBox item={item} />
      const sendMessage = () =>{
        if(!sentMessage) {
            Keyboard.dismiss();
            return;
        }
        const data = {
            receiverId: messageHistory[0].receiverId.patientId,
            adminId: messageHistory[0].adminId.adminId,
            messageContent: sentMessage,
            type:"CLIENT"
        }
        dispatch(createMessage(roomId, data))
        setSentMessage("");
        Keyboard.dismiss();
      }
    return (
        <View style={{...styles.containerGray, height:height}}>
            <View style={{width:"100%", height:30, backgroundColor:"#083344"}}></View>

            {/* HEADER */}
            <View style={{width:"100%", paddingVertical:15, paddingHorizontal:12, backgroundColor:"#06b6d4", display:'flex', flexDirection:'row', gap:10, justifyContent:'flex-start', alignItems:'center',...styles.shadow }}>
                <IonIcons name='arrow-back' style={{color:"white"}} size={25} onPress={()=>navigation.goBack()} />
                <View>
                    <Text style={{color:"#fff",fontWeight:"bold",fontSize:16}}>{messageHistory[0].adminId.firstname}</Text>
                    <Text style={{color:"#fff",fontSize:10}}>Admin</Text>
                </View>
            </View>

            <FlatList
            ref={flatListRef}
            data={messageHistory}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ padding: 10, display: 'flex' }}
            onContentSizeChange={() => scrollToBottom()}
            />

            <View style={{ width:"100%", padding:10, display:'flex', flexDirection:'row', columnGap:10 }}>
              <TextInput
               placeholder='Message' value={sentMessage} style={{paddingVertical:10,paddingHorizontal:15, backgroundColor:"#fff",flexGrow:1,borderRadius:7}}
               onChangeText={(text)=>setSentMessage(text)}
               />

              <Pressable 
              style={{padding:10,backgroundColor:"#06b6d4",display:'flex',justifyContent:'center',alignItems:"center",borderRadius:10}} 
              onPress={sendMessage}
              ><IonIcons name='send' size={25} color={"#fff"} /></Pressable>
            </View>
            
        </View>
    );
}

export default MessageRoom;