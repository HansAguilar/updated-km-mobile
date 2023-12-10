import { View, Pressable, Text, ScrollView, TouchableHighlight, Dimensions, Image, Alert, TouchableOpacity } from 'react-native';
import { styles } from '../../style/styles';
import { useDispatch, useSelector } from 'react-redux';
import AntIcon from "react-native-vector-icons/AntDesign";
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import gcashLogo from '../../assets/images/gcashlogo.png';
import paymayaLogo from '../../assets/images/paymayalogo.png';
import { createPayment, fetchPayment } from '../../redux/action/PaymentAction';
import { createNotification } from '../../redux/action/NotificationAction';
import ToastFunction from "../../config/toastConfig";
import * as io from "socket.io-client";
import { SOCKET_LINK } from '../../config/APIRoutes';
import nopayment from "../../assets/images/nopayment.png";
import Loader from "../../components/Loader";
import { useEffect } from 'react';

const socket = io.connect(SOCKET_LINK);

const SkeletonLoading = () => {
	return (
		<View style={style.skeletonContainer}>
			<View style={{ width: "100%", justifyContent: "space-between", alignItems: "center", gap: 10, flexDirection: "row" }}>
				<View style={style.skeletonSpecialty} />
				<View style={style.skeletonSpecialty} />
			</View>
			<View style={{ width: "100%", justifyContent: "space-between", alignItems: "center", gap: 10, flexDirection: "row" }}>
				<View style={style.skeletonSpecialty} />
				<View style={style.skeletonSpecialty} />
			</View>
		</View>
	);
};

const Payment = ({ navigation }) => {
	const dispatch = useDispatch();
	const { height } = Dimensions.get("screen");
	const [page, setPage] = useState("cash")
	const { patient } = useSelector((state) => { return state.patient });
	const payment = useSelector((state) => { return state?.payment?.payment });

	// const { installment } = useSelector((state)=>{ return state.installment });
	const installment = payment?.filter((val) => val.type === "installment" && val.status === "PENDING" || val.status === "TREATMENT_DONE").sort((a, b) => moment(a.appointment.appointmentDate).isBefore((moment(b.appointment.appointmentDate ? -1 : 1))))
	const [selectedPayment, setSelectedPayment] = useState({
		id: "",
		isActive: false,
		status: "",
		appointmentStatus: "",
		data: null
	});
	const [receipt, setReceipt] = useState("");
	const [paymentType, setPaymentType] = useState("");

	const handleImageUpload = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			aspect: [4, 3],
			quality: 1,
		});

		if (result.canceled) {
			return ToastFunction("error", "Kindly select an image");
		}

		const selectedAsset = result.assets[0];
		const base64Image = await convertAssetToBase64(selectedAsset);
		setReceipt(base64Image);
	}

	const convertAssetToBase64 = async (asset) => {
		const response = await fetch(asset.uri);
		const blob = await response.blob();
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				resolve(reader.result);
			};
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	};

	const handleSubmit = async () => {
		if (!receipt) return Alert.alert("Upload a reciept first.");
		const data = { paymentPhoto: receipt, status: "PENDING", method: paymentType };
		await dispatch(createPayment(selectedPayment.id, data));
		const notificationData = {
			name: "Invoice for Patient Payment",
			time: moment().format("HH:mm:ss"),
			date: moment().format("YYYY-MM-DD"),
			patientId: selectedPayment.data.patient.patientId,
			description: `${selectedPayment.data.patient.firstname} ${selectedPayment.data.patient.lastname} ${selectedPayment.data.description ? 'update the receipt' : `pay Php. ${selectedPayment.data.totalPayment}`}  for appointment ${moment(selectedPayment.data.appointment.appointmentDate).format("L").toString() === moment().format("L").toString() ? "today" : "on"} ${moment(selectedPayment.data.appointment.appointmentDate).format("MMM DD YYYY")}`,
			receiverType: "ADMIN"
		}
		dispatch(createNotification(notificationData));
		const sendData = { value: selectedPayment.data.appointment.appointmentId };
		socket.emit("payment_client_changes", JSON.stringify(sendData));
		setSelectedPayment({ ...selectedPayment, id: "", isActive: false });
		setReceipt("");
	}

	useEffect(() => {
		dispatch(fetchPayment(patient.patientId))
	}, [])

	const Modal = () => {
		const [paymentToggle, setPaymentToggle] = useState(false);

		return (
			<View style={{ height: "100%", width: "100%", backgroundColor: "rgba(0,0,0,0.4)", zIndex: 500, position: 'absolute', paddingHorizontal: 20, display: "flex", justifyContent: 'center', alignItems: "center" }}>
				<View style={{ width: "100%", backgroundColor: "#fff", padding: 20, borderRadius: 6, elevation: 2 }}>

					<View style={{ width: "100%", borderBottomWidth: 1, borderBottomColor: "#e4e4e7", paddingVertical: 10 }}>
						<Text style={{ fontSize: 16, fontWeight: "500", color: "#3f3f46" }}>Upload Your Receipt</Text>
					</View>

					<Text style={{ color: "#ef4444", fontSize: 11, paddingVertical: 6 }}>Please ensure that the reference code is included in the screenshot provided.*</Text>

					{
						selectedPayment.appointmentStatus === "TREATMENT" ? (
							<View style={{ width: "100%" }}>
								<Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Payment Type</Text>

								<Pressable
									style={{ borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 8, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46", display: "flex", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}
									onPress={() => setPaymentToggle(true)}
								>
									<Text style={{ fontSize: 12, textTransform: 'capitalize' }}>{paymentType ? paymentType : "Select payment type"}</Text>
									<AntIcon name='down' size={12} color={"black"} />
								</Pressable>

								{paymentToggle && (
									<View style={{ width: "100%", height: "auto", borderWidth: 1, borderColor: "#e4e4e7" }}>
										<Text onPress={() => {
											setPaymentType("e-payment/gcash");
											setPaymentToggle(false);
										}}
											style={{ width: "100%", paddingVertical: 8, textAlign: 'center', fontSize: 12, textTransform: 'capitalize' }}
										>
											GCash
										</Text>
										<Text onPress={() => {
											setPaymentType("e-payment/paymaya");
											setPaymentToggle(false);
										}}
											style={{ width: "100%", paddingVertical: 8, textAlign: 'center', fontSize: 12, textTransform: 'capitalize' }}
										>
											Paymaya
										</Text>
										<Text onPress={() => {
											setPaymentType("cash");
											setPaymentToggle(false);
										}}
											style={{ width: "100%", paddingVertical: 8, textAlign: 'center', fontSize: 12, textTransform: 'capitalize' }}
										>
											Cash
										</Text>
									</View>
								)}
								{/* CASH */}
								{
									(paymentType && paymentType !== "cash") && (
										<>
											<View style={{ paddingVertical: 10, display: "flex", rowGap: 5, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row' }}>
												{
													paymentType === "e-payment/gcash" ?
														// GCASH
														<View style={{ display: "flex", flexDirection: 'row', columnGap: 3, alignItems: 'center', backgroundColor: "#f4f4f5", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
															<Image source={gcashLogo} style={{ width: 25, height: 25, borderRadius: 20 }} />
															<Text style={{ fontSize: 12 }}>091234567890</Text>
														</View>
														: <View style={{ display: "flex", flexDirection: 'row', columnGap: 3, alignItems: 'center', backgroundColor: "#f4f4f5", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
															<Image source={paymayaLogo} style={{ width: 25, height: 25, borderRadius: 20 }} />
															<Text style={{ fontSize: 12 }}>091234567890</Text>
														</View>
												}
											</View>
											{
												receipt ? (
													<Image source={{ uri: receipt }} style={{ width: "100%", height: 300 }} />)
													: (
														<TouchableHighlight style={{ backgroundColor: "#a5f3fc", width: "100%", padding: 20, marginTop: 15, borderRadius: 10, ...styles.shadow }} onPress={handleImageUpload}>
															<Text style={{ color: "#083344", textAlign: "center" }}>Upload Receipt</Text>
														</TouchableHighlight>
													)}
											<View style={{ width: "100%", paddingVertical: 10, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', columnGap: 10, marginTop: 10 }}>
												<Text style={{ width: 120, paddingVertical: 7, paddingHorizontal: 20, borderWidth: 1, borderColor: "#d4d4d8", textAlign: 'center', borderRadius: 20 }} onPress={() => {
													setSelectedPayment({
														...selectedPayment,
														id: "",
														isActive: false
													});
													setReceipt("")
												}}>Cancel</Text>
												<Text style={{ width: 120, paddingVertical: 7, paddingHorizontal: 20, color: "#fff", backgroundColor: "#06b6d4", textAlign: 'center', borderRadius: 20 }} onPress={handleSubmit}>Submit</Text>
											</View>
										</>
									)
								}

							</View>
						) :
							// E-payment
							(
								<>
									<View style={{ paddingVertical: 10, display: "flex", rowGap: 5, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row' }}>
										{
											paymentType === "e-payment/gcash" ? (
												<View style={{ display: "flex", flexDirection: 'row', columnGap: 3, alignItems: 'center', backgroundColor: "#f4f4f5", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }}>
													<Image source={gcashLogo} style={{ width: 30, height: 30, borderRadius: 4 }} />
													<Text style={{ fontSize: 14, color: "#2b2b2b" }}>09120600101</Text>
												</View>
											)
												: (
													<View style={{ display: "flex", flexDirection: 'row', columnGap: 3, alignItems: 'center', backgroundColor: "#f4f4f5", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }}>
														<Image source={paymayaLogo} style={{ width: 30, height: 30, borderRadius: 4 }} />
														<Text style={{ fontSize: 14, color: "#2b2b2b" }}>09427540968</Text>
													</View>
												)
										}
									</View>
									{
										receipt ? (
											<Image source={{ uri: receipt }} style={{ width: "100%", height: 300 }} />
										) : (
											<TouchableHighlight style={{ backgroundColor: "#0ab1db", width: "100%", padding: 20, marginTop: 15, borderRadius: 6, elevation: 1 }} onPress={handleImageUpload}>
												<Text style={{ color: "#fff", textAlign: "center", fontSize: 15, fontWeight: "500", letterSpacing: .2 }}>Upload Receipt</Text>
											</TouchableHighlight>
										)
									}
									<View style={{ width: "100%", paddingVertical: 10, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', columnGap: 10, marginTop: 10 }}>
										<Text style={{ color: "#2b2b2b", width: 120, paddingVertical: 7, paddingHorizontal: 20, borderWidth: 1, borderColor: "#ccc", textAlign: 'center', borderRadius: 6 }} onPress={() => {
											setSelectedPayment({
												...selectedPayment,
												id: "",
												isActive: false
											});
											setReceipt("")
										}}>Cancel</Text>
										<Text style={{ width: 120, paddingVertical: 7, paddingHorizontal: 20, color: "#fff", backgroundColor: "#06b6d4", textAlign: 'center', borderRadius: 6 }} onPress={handleSubmit}>Submit</Text>
									</View>
								</>)
					}

					{/*  */}
				</View>
			</View>
		)
	}

	const totalAmount = installment?.filter((_, idx) => idx === installment?.length - 1).map((val) => { return { balance: val.balance, totalAmount: val.amountCharge } });

	return(
		<>
			{
				!payment ? (<Loader loading={true} />)
				: (
					<View style={{ ...styles.containerGray, position: 'relative' }}>
					{selectedPayment.isActive && <Modal />}
				<View style={{ width: "100%", padding: 20, display: "flex", flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
					<TouchableHighlight style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4, flex: 1, paddingVertical: 7, borderColor: "#0ab1db", borderWidth: 1, backgroundColor: page === "cash" ? "#0ab1db" : "#fff" }} onPress={() => setPage("cash")}>
						<Text style={{ color: page === "cash" ? "#fff" : "#0ab1db", textAlign: 'center' }}>Cash</Text>
					</TouchableHighlight>
					<TouchableHighlight style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4, flex: 1, paddingVertical: 7, borderColor: "#0ab1db", borderWidth: 1, backgroundColor: page === "installment" ? "#0ab1db" : "#fff" }} onPress={() => setPage("installment")}>
						<Text style={{ color: page === "installment" ? "#fff" : "#0ab1db", textAlign: 'center' }}>Installment</Text>
					</TouchableHighlight>
				</View>

				<ScrollView>
					{
						page === "installment" ? (
							<View style={{ padding: 20 }}>
								<View style={{ justifyContent: "space-between", flexDirection: "row", backgroundColor: "#099ec3", padding: 10 }}>
									<Text style={{ color: "#fff", fontWeight: '400', fontSize: 16 }}>Remaining Balance:</Text>
									<Text style={{ color: "#fff", fontSize: 16 }}>₱ {totalAmount[0]?.balance ? Math.ceil(totalAmount[0]?.balance).toLocaleString() : 0}</Text>
								</View>

								<View style={{ width: "100%", backgroundColor: "#fff", marginTop: 10, borderRadius: 6, padding: 10, flexDirection: 'column' }}>
									<Text style={{ width: "100%", fontSize: 16, paddingBottom: 10, fontWeight: 'bold', color: "#52525b" }}>Payment Schedule</Text>
									<View style={{ marginTop: 10, flex: 1, rowGap: 10, paddingHorizontal: 15 }}>
										{
											installment?.map((val, idx) => (
												<View key={idx} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
													<Text style={{ fontSize: 12 }}>{moment(val.appointment.appointmentDate).format("ddd DD MMM,YYYY")}</Text>
													<Text style={{ fontSize: 12 }}>₱{Math.ceil(val.totalPayment).toLocaleString()}</Text>
													<Text style={{
														fontSize: 11,
														textTransform: 'capitalize',
														borderRadius: 20,
														color: "#fff",
														paddingHorizontal: 12,
														paddingVertical: 2,
														backgroundColor: val.status === "PENDING" ? "#fb923c"
															: val.status === "CHECKING" ? "#fbbf24"
																: val.status === "APPROVED" ? "#14b8a6"
																	: "#ef4444"
														,
													}}>{val.status}</Text>
													{/* <Text style={{fontSize:12, textDecorationLine:'underline',color:"#06b6d4"}}>Pay</Text> */}
												</View>
											))
										}
									</View>
									<View style={{ width: "100%", paddingHorizontal: 20, paddingVertical: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', borderTopWidth: 1, marginTop: 10 }}>
										<Text>Total Amount:</Text>
										<Text>Php. {totalAmount[0]?.totalAmount ? totalAmount[0]?.totalAmount.toLocaleString() : 0}</Text>
									</View>
								</View>
							</View>
						)
							:
							(
								<View style={{ gap: 18, padding: 12 }}>
									{
										payment?.length > 0 ?
											payment
												?.filter((val) => {
													return val.method !== "cash"
												})
												.sort((a, b) => {
													return moment(a.appointment.appointmentDate).isAfter(b.appointment.appointmentDate) ? -1 : 1;
												})
												?.map((val) => (
													<View key={val.paymentId} style={{ paddingHorizontal: 12, gap: 4 }}>
														<Text style={{ fontSize: 12, fontWeight: "500", color: "#595959" }}>{moment(val.appointment.appointmentDate).format("dddd, MMMM D YYYY")}</Text>

														<View style={{ elevation: 1.2, backgroundColor: "#fff", borderRadius: 4, padding: 10, borderTopColor: val.status === "PENDING" ? "#b6eefc" : "#86f9ae", borderTopWidth: 4 }}>
															<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 8 }}>
																<Text style={{ fontSize: 15, fontWeight: "400", color: "#595959" }}>Dr. {val.appointment.dentist.fullname}</Text>
																<View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
																	<Text style={{ fontSize: 14, fontWeight: "500", color: "#3f3f3f" }}>Amount:</Text>
																	<Text style={{ fontSize: 14, fontWeight: "500", color: "#0891b2" }}>₱ {val.totalPayment.toLocaleString()}</Text>
																</View>
															</View>


															<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
																<Text style={{ fontSize: 13, fontWeight: "400", color: "#3f3f3f" }}>Paid Through</Text>
																<View style={{ flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
																	<Text style={{ fontSize: 13, fontWeight: "500", color: "#3f3f3f" }}>{val.method}</Text>
																	<Text style={{ letterSpacing: 0.2, paddingVertical: 2, paddingHorizontal: 12, fontWeight: "500", borderRadius: 50, backgroundColor: val.status === "PENDING" ? "#b6eefc" : "#86f9ae", fontSize: 10, fontWeight: "500", color: val.status === "PENDING" ? "#099ec3" : "#04af6d", borderWidth: 1, borderColor: val.status === "PENDING" ? "#099ec3" : "#04af6d" }}>{val.status}</Text>
																</View>
															</View>

															{
																val.description && (
																	<View style={{ width: "100%", marginVertical: 10, padding: 10, backgroundColor: "#f2f2f2", gap: 6 }}>
																		<Text style={{ fontSize: 14, fontWeight: '500', color: "#ef4444" }}>Your reciept was rejected</Text>
																		<View style={{}}>
																			<Text style={{ fontSize: 12, fontWeight: '400', color: "#3f3f3f" }}>Reason:</Text>
																			<Text style={{ fontSize: 14, color: "#2b2b2b" }}>{val.description}</Text>
																		</View>
																	</View>
																)
															}

															{
																((val.method !== "cash" && val.method !== "hmo") && val.status === "PENDING")
																&& val.appointment.status !== "PENDING"
																&& (
																	<TouchableOpacity style={{ alignItems: "flex-end", marginTop: 10 }}>

																		<Text style={{ borderRadius: 4, fontSize: 14, fontWeight: "400", paddingVertical: 4, paddingHorizontal: 8, backgroundColor: "#099ec3", color: "#fff" }} onPress={() => {
																			setSelectedPayment({
																				...selectedPayment,
																				id: val.paymentId,
																				isActive: true,
																				appointmentStatus: val.appointment.status,
																				data: val
																			})
																			setPaymentType(val.method);
																		}}
																		>Pay Bill</Text>
																	</TouchableOpacity>
																)
															}
														</View>
													</View>
												))
											:
											// <>
											// 	<SkeletonLoading />
											// 	<SkeletonLoading />
											// 	<SkeletonLoading />
											// </>
										<View style={{ alignItems: "center" }}>
											<Image source={nopayment} style={{ width: 300, height: 300 }} />
											<Text style={{ fontSize: 20, fontWeight: "500", color: "#595959", textAlign: "center" }}>Your dental payments are up to date!</Text>
										</View>
									}
								</View>
							)
					}
				</ScrollView >
			</View >
			
				)
			}
		</>
	);
}

export default React.memo(Payment);

const style = {
	skeletonContainer: {
		borderWidth: 1.2,
		borderColor: '#f2f2f2',
		width: '100%',
		backgroundColor: '#fff',
		borderRadius: 8,
		padding: 15,
		elevation: 1,
		shadowRadius: 8,
		shadowOffset: .2,
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		borderRadius: 10,
		gap: 10,
		paddingVertical: 20
	},
	skeletonInfo: {
		width: '80%',
		height: 40,
		backgroundColor: '#f2f2f2',
		marginBottom: 10,
	},
	skeletonSpecialty: {
		width: '50%',
		height: 15,
		backgroundColor: '#f2f2f2',
	},
}