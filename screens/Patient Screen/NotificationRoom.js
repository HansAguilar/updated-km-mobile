import React, { useState } from "react";
import { View, ScrollView, Text, Dimensions, Pressable, Image } from 'react-native';
import { useSelector } from "react-redux";
import NotificationModal from "../../components/NotificationModal";
import kmlogo from "../../assets/images/gcashlogo.png";

const NotificationRoom = () => {
	const { height, width } = Dimensions.get("screen");
	const notification = useSelector((state) => state.notification.notification);
	const [readNotification, setReadNotification] = useState({
		id: null,
		isShow: false
	});

	return (
		<View>
			{readNotification.isShow && <NotificationModal notification={readNotification} setNotificationData={setReadNotification} />}
			<ScrollView style={{ height: "100%", maxHeight: height, width: width, zIndex: 1 }}>
				<View style={{ gap: 8 }}>
					{
						notification && notification.map((val, idx) => (
							<Pressable key={idx} style={{ width: width, backgroundColor: "#fff", padding: 15, gap: 6, borderWidth: 1, borderColor: "#f2f2f2" }} onPress={() => setReadNotification({ ...readNotification, id: val.notificationId, isShow: true })}>
								<View style={{ gap: 8, flexDirection: "row" }}>
									<Image source={kmlogo} style={{ width: 50, height: 50 }} />
									<View style={{ width: "100%", display: "flex", flexDirection: "column", flexWrap: "wrap", width: "100%" }}>
										<Text style={{ fontSize: 15, fontWeight: "500", color: "#3f3f3f" }}>{val.name}</Text>
										{
											val.status === "UNREAD" &&
											<View style={{ width: 10, height: 10, borderRadius: 50, backgroundColor: "red" }}>
											</View>
										}
										<Text style={{ fontSize: 12, color: "#595959" }}>{val.description.length > 53 ? val.description.substring(0, 53) + "\n" + val.description.substring(53) : val.description}</Text>
									</View>
								</View>

							</Pressable>
						))
					}
				</View>
			</ScrollView>
		</View>
	)
}

export default React.memo(NotificationRoom);