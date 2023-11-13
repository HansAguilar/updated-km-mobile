import React from "react";
import { Text, View, Dimensions, ScrollView, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { styles } from "../../../style/styles";

function Message({ setMessageHistory, navigation }) {
  const messages = useSelector((state) => { return state.messages.message });
  const { height } = Dimensions.get("screen");
  //   console.log(Object.entries(messages).map(([k,v])=>{
  //     console.log(v.length)
  //   }));
  const selectMessage = (key, value) => {
    setMessageHistory(value);
    navigation.navigate("Message Room", { roomId: key });
  }
  return (
    <View style={{ ...styles.containerGray, height: height, }}>
      <ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 20, display: "flex", rowGap: 10 }}>
        {
          messages ? messages.map((val, idx) => (
            <Pressable key={idx} style={{ width: "100%", paddingHorizontal: 20, paddingVertical: 20, backgroundColor: "white", borderRadius: 20 }} onPress={() => selectMessage(val.roomId, val)}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>Admin {val.adminId.firstname}</Text>
              <Text style={{ fontSize: 12 }}>{val.messageEntityList[val.messageEntityList.length - 1].messageContent}</Text>
            </Pressable>
          ))
            : <Text>No Message</Text>
        }
      </ScrollView>
      {/* <View style={{height:80, width:"100%",backgroundColor:"#000"}}></View> */}
    </View>
  )
}

export default React.memo(Message);