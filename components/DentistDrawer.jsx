import React from 'react';
import { View, Text, Pressable, Image, StatusBar } from 'react-native';
import { styles } from '../style/styles';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logOutAccount } from '../redux/action/LoginAction';
import Feather from "react-native-vector-icons/Feather";

const height = StatusBar.currentHeight;

const links = [
	{
		name: "Dashboard",
		link: "Dashboard",
		active: true,
		icon: "home"
	},
	{
		name: "Prescription",
		link: "Prescription",
		icon: "file"
	},
]


export default function CustomDrawer({ navigation, isSideNavShow, setSideNavShow }) {
	const { activeDentist } = useSelector((state) => { return state.dentist });
	const dispatch = useDispatch();


	const logoutButton = async () => {
		setSideNavShow(false);
		dispatch(logOutAccount());
		AsyncStorage.removeItem("token");
		navigation("Home")
	}
	return isSideNavShow && (
		<Pressable style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute', zIndex: 300 }} onPress={(e) => { setSideNavShow(false); }}>
			<Pressable style={{ width: '80%', height: '100%', backgroundColor: '#fff', position: 'absolute', paddingHorizontal: 15, left: isSideNavShow ? 0 : -500, ...styles.shadow }} onPress={(e) => { e.stopPropagation(); }}>
				<View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: height + 15, paddingBottom: 15, gap: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>

					<View style={{ borderWidth: 1, borderColor: '#06b6d4', borderRadius: 50 }}>
						<Image source={{ uri: activeDentist?.profile }} style={{ width: 80, height: 80, borderRadius: 50 }} />
					</View>

					<View>
						<Text style={{ fontSize: 16, fontWeight: '400', color: '#3f3f46' }}>Dr. {activeDentist?.fullname}</Text>
						<Text style={{ fontSize: 14, fontWeight: 'bold', color: '#06b6d4' }} onPress={() => {
							navigation("Details");
							setSideNavShow(false);
						}}>View Profile</Text>
					</View>
				</View>

				<View style={{ display: 'flex', rowGap: 10, paddingTop: 15 }}>
					{
						links.map((val, idx) => (
							<Pressable style={{ width: '100%', flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8, paddingHorizontal: 8, backgroundColor: val?.active ? '#06b6d4' : '', borderRadius: 4 }} key={idx} onPress={() => {
								setSideNavShow(false);
								navigation(val.link);
							}}>
								<Feather name={val.icon} size={20} style={{ color: val?.active ? '#fff' : "#3f3f46" }} />
								<Text style={{ color: val?.active ? '#fff' : "#3f3f46" }}>{val.name}</Text>
							</Pressable>
						))
					}
					<Pressable style={{ width: '100%', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 10, flexDirection: "row", alignItems: "center", gap: 8, }}>
						<Feather name="power" size={20} style={{ color: "#3f3f46" }} />
						<Text onPress={logoutButton}>Logout</Text>
					</Pressable>
				</View>

			</Pressable>
		</Pressable>
	)
}
