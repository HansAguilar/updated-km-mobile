import React, { useState } from 'react';
import { Text, View, Dimensions, ScrollView, Pressable, TextInput } from "react-native";
import Toast from 'react-native-toast-message';
import  ToastFunction from '../config/toastConfig';
import { useDispatch, useSelector } from 'react-redux';
import { createNewMessage, sendPatientMessage } from '../redux/action/MessageAction';

function CreateMessageModal({modal, setModal}) {
    const dispatch = useDispatch();
    const admin = useSelector((state)=>state.admin.admin);
    const patientLogin = useSelector((state)=>state.patient.patient);
    const messages = useSelector((state) => { return state.messages.message });

    const [messageData, setMessageData] = useState({
        adminId:"",
        adminName:"",
        receiverId:patientLogin.patientId,
        messageContent:"",
        type:"CLIENT"
    });
    const [suggestion, setSuggestion] = useState([]);
    
    const handleChange = (name, text) => {
        if(name === "adminName"){
            const searchAdmin = admin.filter((val)=>(val.firstname).toLowerCase().includes(messageData.adminName.toLowerCase()));
            setSuggestion(searchAdmin);
        }
        setMessageData({...messageData, [name]:text})
    };
    // const key = `${messageDetails.adminId}-${messageDetails.receiverId}`;
    
    const submitButton = () =>{
        if(!messageData.adminId || !messageData.adminName || !messageData.messageContent){
            return ToastFunction("error", "Fill up empty field");
        }
        const key = `${messageData.adminId}-${messageData.receiverId}`;
        const filteredData = messages.filter((val)=>val.roomId === key);
        if(filteredData.length > 0){
            dispatch(sendPatientMessage(key, messageData));
        }else{
            dispatch(createNewMessage(key, messageData));
        }
        clearData();
    }
    const clearData = () =>{
        setMessageData({
            adminId:"",
            adminName:"",
            receiverId:patientLogin.patientId,
            messageContent:"",
            type:"CLIENT"
        });
        setModal(false);
    }

    return (
            <View style={{height:"100%", width:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)", position:'absolute',zIndex:10,padding:20, display:'flex', justifyContent:'center', alignItems:'center'}}>
            <View style={{backgroundColor:"white", padding:10, height:"auto", width:"100%"}}>
                
                <View>
                    <Text>Search Admin</Text>
                    <TextInput 
                    value={messageData.adminName}
                    style={{width:"100%",borderWidth:1,paddingVertical:5,paddingHorizontal:10 }}
                    onChangeText={(text)=>handleChange("adminName", text)}
                    placeholder='Search..'/>
                    {
                        suggestion.length > 0 && (
                            <View style={{marginTop:10}}>
                                {
                                    suggestion.map((val,idx)=>(
                                        <Text 
                                        key={idx} 
                                        style={{padding:10,width:"100%",borderBottomWidth:1}}
                                        onPress={()=>{
                                            setMessageData({...messageData, adminId:val.adminId, adminName:`Admin ${val.firstname}`});
                                            setSuggestion([]);
                                        }}
                                        >Admin {val.firstname}</Text>
                                    ))
                                }
                            </View>
                        )
                    }
                </View>

                {
                    messageData.adminId && messageData.adminName && (
                        <View style={{marginTop:10}}>
                            <Text>Message content</Text>
                             <TextInput
                                style={{height: 100, borderColor: 'gray',borderWidth: 1, padding: 8,}}
                                multiline
                                numberOfLines={4}
                                placeholder="Type here..."
                                value={messageData.messageContent}
                                onChangeText={(value) => handleChange("messageContent", value)}
                            />
                        </View>
                    )
                }
                
                <View style={{width:"100%", display:'flex', flexDirection: 'row',justifyContent:'space-between', alignItems:'center', columnGap:10, marginTop:10}}>
                    <Text 
                    style={{flex:1, borderRadius:10, backgroundColor:"#ef4444",paddingVertical:10,textAlign:'center', color:'white'}}
                    onPress={clearData}
                    >Cancel
                    </Text>
                    <Text 
                    onPress={submitButton}
                    style={{flex:1, borderRadius:10, backgroundColor:"#10b981",paddingVertical:10,textAlign:'center', color:'white'}}>
                        Submit
                    </Text>
                </View>
            </View>
            <Toast />
        </View>
    );
}

export default CreateMessageModal;