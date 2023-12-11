import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Dimensions, Image, FlatList, TextInput, Pressable, Keyboard } from "react-native";
import { sendPatientMessage } from "../../../redux/action/MessageAction";
import { styles } from '../../../style/styles';
import IonIcons from "react-native-vector-icons/Ionicons";
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { MessageBox } from "../../../components/MessageBox"

function MessageRoom({ route, navigation, }) {
    const { roomId } = route.params;
    const messageList = useSelector((state) => { return state.messages.message.filter((val) => val.roomId === roomId) });
    const messageHistory = { ...messageList[0] }
    // const messageChat = useSelector((state)=>{return state.messages.message.filter((val)=>val.roomId===roomId)}).map((val)=>val.messageEntityList);

    const { height } = Dimensions.get("screen");
    const flatListRef = useRef();
    const [sentMessage, setSentMessage] = useState("");
    const dispatch = useDispatch();

    const scrollToBottom = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: false });
        }
    };
    if (!roomId) {
        navigation.navigate(-1);
    }

    useEffect(() => {
        scrollToBottom();
    }, []);

    const renderItem = ({ item }) => <MessageBox item={item} />

    const sendMessage = () => {
        if (!sentMessage) {
            Keyboard.dismiss();
            return;
        }
        const data = {
            receiverId: messageHistory.receiverId.patientId,
            adminId: messageHistory.adminId.adminId,
            messageContent: sentMessage,
            type: "CLIENT"
        }
        const roomKey = `${data.adminId}-${data.receiverId}`;
        dispatch(sendPatientMessage(roomKey, data))
        setSentMessage("");
        Keyboard.dismiss();
    }
    return (
        <View style={{ ...styles.containerGray, height: height }}>
            <View style={{ width: "100%", height: 30, backgroundColor: "#083344" }}></View>
            {/* HEADER */}
            <View style={{ width: "100%", paddingVertical: 15, paddingHorizontal: 12, backgroundColor: "#06b6d4", display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'flex-start', alignItems: 'center', ...styles.shadow }}>
                <IonIcons name='arrow-back' style={{ color: "white" }} size={25} onPress={() => navigation.goBack()} />
                <View>
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{messageHistory.adminId.firstname}</Text>
                    <Text style={{ color: "#fff", fontSize: 10 }}>Admin</Text>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={messageHistory.messageEntityList}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ padding: 10, display: 'flex' }}
                onContentSizeChange={() => scrollToBottom()}
            />

            <View style={{ width: "100%", height: 70, padding: 12, flexDirection: 'row', gap: 6, alignItems: "center" }}>
                <ScrollView>
                    <View style={{ zIndex: 500 }}>
                        <TextInput
                            placeholder='Message' value={sentMessage} style={{
                                paddingHorizontal: 15, backgroundColor: "#fff", width: "100%", borderRadius: 6,
                            }}
                            onChangeText={(text) => setSentMessage(text)} multiline numberOfLines={3}
                        />
                    </View>
                </ScrollView>


                <Pressable
                    style={{ padding: 10, backgroundColor: "#06b6d4", display: 'flex', justifyContent: 'center', alignItems: "center", borderRadius: 6 }}
                    onPress={sendMessage}
                ><IonIcons name='send' size={25} color={"#fff"} /></Pressable>
            </View>
        </View>
    );
}

export default React.memo(MessageRoom);