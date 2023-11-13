import React from 'react';
import { View, Text, Pressable, Image, } from 'react-native';
import { styles } from '../style/styles';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logOutAccount } from '../redux/action/LoginAction';
import IonicIcon from 'react-native-vector-icons/Ionicons';

export default function CustomDrawer({ navigation, isSideNavShow, setSideNavShow }) {
    const { activeDentist } = useSelector((state) => { return state.dentist });
    const dispatch = useDispatch();

    const links = [
        {
            name: "Dashboard",
            link: "Dashboard",
            active: true,
        },
        {
            name: "Prescription",
            link: "Prescription"
        },
    ]

    const logoutButton = async () => {
        setSideNavShow(false);
        dispatch(logOutAccount());
        AsyncStorage.removeItem("token");
        navigation("Home")
    }
    return isSideNavShow && (
        <Pressable style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute', zIndex: 300 }} onPress={(e) => { setSideNavShow(false); }}>
            <Pressable style={{ width: '80%', height: '100%', backgroundColor: '#fff', position: 'absolute', paddingHorizontal: 15, left: isSideNavShow ? 0 : -500, ...styles.shadow }} onPress={(e) => { e.stopPropagation(); }}>
                <View style={{ height: 50, width: "100%", display: 'flex', justifyContent: "flex-end", alignItems: 'flex-end' }}>
                    {/* <IonicIcon name='arrow-back' size={25} color={"#06b6d4"} onPress={()=>{setSideNavShow(false)}}/> */}
                </View>
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e4e4e7' }}>
                    <View style={{ width: 90, height: 90, backgroundColor: '#06b6d4', padding: 5, borderRadius: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: activeDentist?.profile }} style={{ width: 80, height: 80, borderRadius: 50 }} />
                    </View>
                    <View>
                        <Text>Dr. {activeDentist?.fullname}</Text>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#06b6d4' }} onPress={() => {
                            navigation("Details");
                            setSideNavShow(false);
                        }}>View Profile</Text>
                    </View>
                </View>

                <View style={{ display: 'flex', rowGap: 10, marginTop: 10 }}>
                    {
                        links.map((val, idx) => (
                            <Pressable style={{ width: '100%', paddingVertical: 8, paddingHorizontal: 8, backgroundColor: val?.active ? '#06b6d4' : '', borderRadius: 10 }} key={idx} onPress={() => {
                                setSideNavShow(false);
                                navigation(val.link);
                            }}>
                                <Text style={{ color: val?.active && '#fff', }}>{val.name}</Text>
                            </Pressable>
                        ))
                    }
                    <Pressable style={{ width: '100%', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 10 }}>
                        <Text onPress={logoutButton}>Logout</Text>
                    </Pressable>
                </View>

            </Pressable>
        </Pressable>
    )
}
