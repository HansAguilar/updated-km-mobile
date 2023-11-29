import React from "react";
import { useEffect } from "react";
import { View, ScrollView, Text, Dimensions, Pressable } from 'react-native';
import { useDispatch, } from "react-redux";
import { readPatientNotification } from "../redux/action/NotificationAction";
import { useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";

const NotificationBox = ({ notification, setNotificationData }) => {
    const { height, width } = Dimensions.get("screen");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const readFunction = () => {
        dispatch(readPatientNotification(notification.id, setData));
    }
    useEffect(() => {
        readFunction();
    }, [])
    return data && (
        <View style={{ height: height, width: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", position: 'absolute', zIndex: 10, padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 6 }}>
                <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                    <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: "500" }}>{data.name}</Text>
                    <AntDesign name="closecircleo" style={{ color: "red" }} size={20} onPress={() => setNotificationData({ ...notification, isShow: false })} />
                </View>
                <Text>{data.description}</Text>
            </View>
        </View>
    )
}

export default React.memo(NotificationBox);