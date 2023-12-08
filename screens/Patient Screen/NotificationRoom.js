import React, { useState } from "react";
import { View, ScrollView, Text, Dimensions, Pressable, Image } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import NotificationModal from "../../components/NotificationModal";
import kmlogo from "../../assets/images/logo2.jpg";
import empty from "../../assets/images/empty.png"
import { deleteAllNotification } from "../../redux/action/NotificationAction";

const NotificationRoom = () => {
	const { width } = Dimensions.get("screen");
	const notification = useSelector((state) => state.notification.notification);
	const patient = useSelector((state) => { return state.patient.patient });
	const [readNotification, setReadNotification] = useState({
		id: null,
		isShow: false
	});
	const dispatch = useDispatch();

	return (
		<View style={{ height: "100%", width: width, zIndex: 50 }}>
			{readNotification.isShow && <NotificationModal notification={readNotification} setNotificationData={setReadNotification} />}

			<ScrollView>
				<View style={{ height: "100%" }}>
					{
						notification?.length > 0 ?
							<>
								<View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
									<Text style={{ textDecorationLine: "underline" }} onPress={() => dispatch(deleteAllNotification(patient.patientId))}>Delete all notification</Text>
								</View>
								{
									notification.map((val, idx) => (
										<Pressable key={idx} style={{ width: width, backgroundColor: val.status === "UNREAD" ? "#ECF8FE" : "#fff", padding: 15, gap: 6, borderWidth: 1, borderColor: "#f2f2f2", zIndex: 50 }} onPress={(prev) => setReadNotification({ ...prev, id: val.notificationId, isShow: true })}>
											<View style={{ gap: 8, flexDirection: "row" }}>
												<Image source={kmlogo} style={{ width: 50, height: 50 }} />
												<View style={{ width: "100%", display: "flex", flexDirection: "column", flexWrap: "wrap", width: "100%" }}>
													<View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
														<Text style={{ fontSize: 15, fontWeight: "500", color: "#3f3f3f" }}>{val.name}</Text>

														{
															val.status === "UNREAD" &&
															<View style={{ width: 10, height: 10, borderRadius: 50, backgroundColor: "red" }}>
															</View>
														}
													</View>

													<Text style={{ fontSize: 12, color: "#595959" }}>{val.description.length > 53 ? val.description.substring(0, 53) + "\n" + val.description.substring(53) : val.description}</Text>
												</View>
											</View>

										</Pressable>
									))
								}
							</>
							:
							<View style={{ padding: 20, alignItems: "center" }}>
								<Image source={empty} style={{ width: 300, height: 300 }} />
								<Text style={{ fontSize: 18, textAlign: "center", fontWeight: "500", color: "#595959" }}>Exciting things happen when you take the first step!</Text>
							</View>
					}
				</View>
			</ ScrollView>
		</View >
	)
}

export default React.memo(NotificationRoom);