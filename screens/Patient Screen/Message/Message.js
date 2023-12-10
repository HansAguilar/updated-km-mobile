import React, { useState } from "react";
import { Text, View, Dimensions, ScrollView, Pressable, Image } from "react-native";
import { useSelector } from "react-redux";
import { styles } from "../../../style/styles";
import CreateMessageModal from "../../../components/CreateMessageModal";
import AntDesign from "react-native-vector-icons/AntDesign";
import respect from "../../../assets/images/respect.png";

function Message({ setMessageHistory, navigation }) {
  const messages = useSelector((state) => { return state.messages.message });
  const { height, width } = Dimensions.get("screen");
  const [createMessageModal, setCreateMessageModal] = useState(false);

  const selectMessage = (key, value) => {
    navigation.navigate("Message Room", { roomId: key });
  }

  return (
    <>
      {createMessageModal && <CreateMessageModal modal={createMessageModal} setModal={setCreateMessageModal} />}
      <View style={{ ...styles.containerGray, height: height, width: width, position: "relative", }}>

        <View style={{ height: "100%", width: "100%" }}>
          {
            messages?.length > 0 ?
              <ScrollView contentContainerStyle={{ width: "100%", }}>
                {
                  messages && messages?.map((val, idx) => (
                    <Pressable key={idx} style={{ paddingHorizontal: 20, paddingVertical: 20, backgroundColor: "white", borderRadius: 6, borderBottomColor: "#ccc", borderBottomWidth: .5 }} onPress={() => selectMessage(val.roomId, val)}>
                      <Text style={{ fontSize: 16, fontWeight: "500", color: "#3f3f3f" }}>Admin {val.adminId.firstname}</Text>
                      <Text style={{ fontSize: 14, color: "#595959" }}>{val.messageEntityList[val.messageEntityList.length - 1].messageContent}</Text>
                    </Pressable>
                  ))
                }
              </ScrollView>
              :
              <View style={{ alignItems: "center", padding: 20, width: "100%" }}>
                <Image source={respect} style={{ width: 300, height: 300 }} />
                <Text style={{ fontSize: 18, textAlign: "center", fontWeight: "500", color: "#595959" }}>No messages yet, but your inbox is ready when you are. Keep it friendly and respectful!</Text>
              </View>
          }
        </View>


        <Pressable onPress={() => setCreateMessageModal(true)} style={{ backgroundColor: "#06b6d4", color: "#fff", borderRadius: 50, width: 50, height: 50, position: "absolute", zIndex: 50, bottom: 30, left: 20, alignItems: "center", justifyContent: "center" }}>
          <AntDesign name="plus" size={40} color="#fff" />
        </Pressable>

      </View>
    </>
  )
}

export default React.memo(Message);