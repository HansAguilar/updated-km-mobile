import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TextInput, Pressable, Picker, Alert } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { useDispatch, useSelector } from 'react-redux';
import AntIcon from "react-native-vector-icons/AntDesign";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { createDentistTreatment, createTreatment } from "../redux/action/AppointmentAction";
import { fetchPayment } from "../redux/action/PaymentAction";
import toastFunction from "../config/toastConfig";
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import AntDesign from "react-native-vector-icons/AntDesign";

function TreatmentModal({ setModal, treatmentData }) {
	const { height } = Dimensions.get("screen");
	const [dentalServices, setDentalServices] = useState([...treatmentData.dentalServices]);
	const services = useSelector((state) => state.services.services)
	const [suggestion, setSuggestion] = useState([]);
	const [searchService, setSearchService] = useState("");
	const [date, setDate] = useState(new Date());
	const dateRef = useRef("");
	const dispatch = useDispatch();
	const installment = useSelector((state) => state.payment.payment?.filter((val) => val.type === "installment" && val.status === "PENDING"));
	const hmo = useSelector((state) => state.insurance.allInsurance.filter((val) => val.patient.patientId === treatmentData.patient.patientId));
	const [hmoList, setHmoList] = useState(null);

	useEffect(() => {
		dispatch(fetchPayment(treatmentData.patient.patientId));
	}, [treatmentData]);

	useEffect(() => {
		setHmoList(hmo);
	}, [treatmentData.patient.patientId]);

	const [toothChart, setToothChart] = useState([...Array(32)].map((_, idx) => ({
		name: idx + 1 > 9 ? `${idx + 1}` : `0${idx + 1}`,
		value: idx + 1,
		isClick: false
	})));
	const [toothToggle, setToothToggle] = useState(false);
	const [selectedTeeth, setSelectedTeeth] = useState([]);

	const [treatmentValue, setTreatmentValue] = useState({
		treatmentNumberOfDay: "",
		treatmentDateType: "",
	});
	const treatmentDateList = ["day", "week", "month"];
	const [treatmentDateListToggle, setTreatmentDateListToggle] = useState(false);
	const [showPicker, setShowPicker] = useState(false);

	const [paymentType, setPaymentType] = useState("");
	const [totalAmount, setTotalAmount] = useState(treatmentData.dentalServices.reduce((acc, val) => { return acc + parseInt(val.price) }, 0));
	const [paymentToggle, setPaymentToggle] = useState(false);
	const [patientHMO, setPatientHMO] = useState({
		hmoId: "",
		hmoName: "",
		isShow: false
	});

	const handleSearchService = (text) => {
		const filteredData = services
			.filter((val) => (val.name).toLowerCase().includes(searchService.toLowerCase()))
			.filter((val) => {
				const result = dentalServices.some((a) => a.name === val.name);
				return !result;
			});
		setSuggestion(filteredData);
		setSearchService(text);
	}

	const selectTeethHandler = (idx) => {
		const updatedToothChart = [...toothChart];
		updatedToothChart[idx].isClick = !updatedToothChart[idx].isClick;
		if (updatedToothChart[idx].isClick) {
			setSelectedTeeth([...selectedTeeth, idx + 1]);
		} else {
			const update = selectedTeeth.filter((val) => val !== idx + 1);
			setSelectedTeeth(update)
		}
		setToothChart(updatedToothChart);
	}

	const handleTreatment = (text) => {
		setTreatmentValue({ ...treatmentValue, treatmentNumberOfDay: text });
	}

	const onChangeText = (text) => {
		setDate(text);
	}

	const onChangeDate = ({ type }, selectedDate) => {
		if (type === "set") {
			// Adjust the selected date to Philippine time zone
			const adjustedDate = new Date(selectedDate);
			const offset = 480; // Offset in minutes for UTC+8 (Philippine time zone)
			adjustedDate.setMinutes(adjustedDate.getMinutes() + offset);

			setDate(adjustedDate);

			const formattedDate = moment(adjustedDate).format("LL");
			dateRef.current = formattedDate;

			if (Platform.OS === "android") {
				toggleDatepicker();
				setDate(adjustedDate);
				dateRef.current = formattedDate;
			}
		} else {
			toggleDatepicker();
		}
	};

	const handleAppointmentStart = () => setShowPicker(true);

	const toggleDatepicker = () => {
		setShowPicker(!showPicker);
	};

	const handleSubmitButton = () => {
		// Hans add ka validation dito sa mga empty field
		if (!treatmentValue.treatmentNumberOfDay || !treatmentValue.treatmentDateType || !dateRef.current || !paymentType) {
			// toastFunction("error", "Fill up empty field!")
			return Alert.alert("Fill empty field!")
		}
		if (patientHMO.isShow && !patientHMO.hmoId) {
			return Alert.alert("Fill hmo field!")
		}
		if (dentalServices.length < 0 || !date || !treatmentValue.treatmentNumberOfDay || treatmentValue.treatmentDateType|| !paymentType) {
			toastFunction("error", "Fill up empty field");
		}
		const data = {
			appointmentId: treatmentData.appointmentId,
			dentalServices: dentalServices.map((val) => val.serviceId),
			teeth: selectedTeeth,
			timeSubmitted: moment().format("HH:mm:ss"),
			timeDuration: calculateTotalServiceTime(),
			startOfTreatment: date,
			treatmentNumber: treatmentValue.treatmentNumberOfDay,
			treatmentType: treatmentValue.treatmentDateType,
			paymentType: paymentType,
			amount: totalAmount,
			insuranceId: patientHMO.hmoId
		}
		dispatch(createDentistTreatment(data));
		setModal(false);
	}

	const calculateTotalServiceTime = () => {
		const timeEnd = dentalServices.map((val) => {
			return val.duration;
		})
		let total = 0;
		for (const duration of timeEnd) {
			const timeParts = duration.toLocaleString().split(':');
			const hours = parseInt(timeParts[0], 10);
			const minutes = parseInt(timeParts[1], 10);
			const seconds = parseInt(timeParts[2], 10);

			const durationInMillis = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
			total += durationInMillis;
		}

		const convertTotalTime = moment.duration(total);
		return moment.utc(convertTotalTime.asMilliseconds()).format('HH:mm:ss');
	}

	const daysPerSelection = [
		{ type: "day", number: 6 },
		{ type: "week", number: 3 },
		{ type: "month", number: 12 },
	]
	const [daysToggle, setDaysToggle] = useState(false);

	const currentDate = moment();
	currentDate.add(1, 'day');

	return (
		<View style={{ height: "100%", width: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", position: 'absolute', zIndex: 10, padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<View style={{ width: "100%", height: 600, maxHeight: 600, backgroundColor: "white", padding: 20, borderRadius: 10, zIndex: -10 }}>
				<Text style={{ fontSize: 18, fontWeight: 'bold', color: "#52525b", width: "100%", paddingBottom: 5, borderBottomWidth: 1, borderColor: "#CCC" }}>Treatment Data</Text>
				<ScrollView style={{ width: "100%", height: "100%", marginVertical: 15 }}>

					{/* Appointment Info */}
					<View>
						<Text style={{ marginBottom: 10, fontWeight: "bold", color: "#595959", fontSize: 16 }}>Appointment Information</Text>
						<View style={{ gap: 10, paddingHorizontal: 8 }}>

							{/* PATIENT NAME */}
							<View style={{ gap: 4, width: "100%" }}>
								<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Patient Name</Text>
								<TextInput value={`${treatmentData.patient.firstname} ${treatmentData.patient.lastname}`} editable={false} style={{ ...style.inputTextStyle, backgroundColor: "#fafafa" }} />
							</View>

							{/* DENTIST NAME */}
							<View style={{ gap: 4, width: "100%" }}>
								<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Dentist Name</Text>
								<TextInput value={`Dr. ${treatmentData.dentist.fullname}`} editable={false} style={{ ...style.inputTextStyle, backgroundColor: "#fafafa" }} />
							</View>

							{/* SERVICES */}
							<View style={{ gap: 4, width: "100%" }}>
								<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Services</Text>
								<View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap" }}>
									{
										dentalServices.map((val, idx) => (
											<View key={idx} style={{ backgroundColor: "#cef6fd", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
												<Text style={{ color: "#06b6d4", }}>{val.name}</Text>
												<Pressable style={{ borderColor: "red", borderWidth: 1, padding: 1, borderRadius: 20 }}
													onPress={() => {
														setTotalAmount((prev) => prev - val.price)
														setDentalServices(prev => {
															return prev.filter((p) => p.serviceId !== val.serviceId)
														})
													}
													}
												>
													<EntypoIcon name="cross" color="red" />
												</Pressable>
											</View>
										))
									}
								</View>

								<TextInput value={searchService} onChangeText={handleSearchService} style={{ ...style.inputTextStyle }} />

								{
									searchService && suggestion.length > 0
										? suggestion.map((val, idx) => <Text
											key={idx}
											style={{ width: "100%", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f4f4f5" }}
											onPress={() => {
												setTotalAmount((prev) => prev + val.price)
												setDentalServices((prev) => [...prev, val])
												setSearchService("");
											}}
										>
											{val.name}
										</Text>)
										: searchService && suggestion.length < 1 ? <Text style={{ color: "red", backgroundColor: "#ffe6e6", padding: 4 }}>No existing services</Text>
											: <></>
								}
							</View>


							{/* Teeth */}
							<View style={{ gap: 4, width: "100%" }}>
								<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Teeth</Text>
								<Pressable style={{ ...style.subDropdownStyle }} onPress={(prev) => setToothToggle(!toothToggle)}>
									<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingHorizontal: 18, paddingVertical: 8, }}>
										<Text style={{ fontSize: 14, color: "#2b2b2b" }}>{selectedTeeth.length > 0 ? `${selectedTeeth.length} tooth selected` : "None"}</Text>
										<AntDesign name={toothToggle ? "down" : "up"} color="#2b2b2b" />
									</View>
								</Pressable>

								{
									toothToggle && (
										<View style={{ width: "100%", flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }}>
											{
												toothChart.map((val, idx) => (
													<View style={{ backgroundColor: val.isClick ? "#cef6fd" : "#fff", borderRadius: 5, borderWidth: 1, padding: 10, width: "20%", margin: 4, borderColor: val.isClick ? "#06b6d4" : "#e6e6e6", }} key={idx}>
														<Text
															style={{
																color: val.isClick ? "#06b6d4" : "#52525b",

																textAlign: "center",
															}}
															onPress={() => selectTeethHandler(idx)}
														>{val.name}</Text>
													</View>

												))
											}
											<Text key={"none"}
												style={{
													padding: 10, backgroundColor: "#ed6868",
													color: "#fff", borderRadius: 4,
													textAlign: "center", width: "20%", margin: 4
												}}
												onPress={() => {
													setSelectedTeeth([]);
													setToothChart((prev) => {
														return prev.map(val => ({ ...val, isClick: false }))
													})
													setToothToggle(false)
												}}
											>None</Text>
										</View>
									)
								}
								{selectedTeeth.length > 0 && toothToggle && <Text style={{ backgroundColor: "#06b6d4", paddingVertical: 6, textAlign: 'center', color: "#fff", borderRadius: 4 }} onPress={() => setToothToggle(false)}>Done</Text>}
							</View>
						</View>
					</View>


					<View style={{ marginTop: 20, borderTopWidth: 1, paddingTop: 10, borderTopColor: "#ccc" }}>
						{/* Treatment Info */}
						<Text style={{ marginBottom: 10, fontWeight: "bold", color: "#595959", fontSize: 16 }}>Treatment Schedule</Text>

						<View style={{ gap: 10, paddingHorizontal: 8 }}>
							{/* DATE TYPE */}
							<View style={{ gap: 4, width: "100%" }}>
								<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Treatment Date Type</Text>
								<Pressable style={{ ...style.subDropdownStyle }} onPress={() => setTreatmentDateListToggle(!treatmentDateListToggle)}>
									<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingHorizontal: 18, paddingVertical: 8, }}>
										<Text style={{ fontSize: 14, color: "#2b2b2b",textTransform:'capitalize' }}>{treatmentValue.treatmentDateType ? treatmentValue.treatmentDateType : "Select treatment type"}</Text>
										<AntDesign name={treatmentDateListToggle ? "down" : "up"} color="#2b2b2b" />
									</View>
								</Pressable>

								{
									treatmentDateListToggle && (
										<View style={{ width: "100%", borderWidth: 1, borderColor: "#e4e4e7" }}>
											{
												treatmentDateList.map((val, idx) => (
													<Text key={idx} onPress={() => {
														setTreatmentValue({ ...treatmentValue, treatmentDateType: val, treatmentNumberOfDay:"" })
														setTreatmentDateListToggle(false);
													}} style={{ width: "100%", paddingVertical: 10, textAlign: 'center', fontSize: 14, textTransform: 'capitalize' }}>{val}</Text>
												))
											}
										</View>
									)
								}
							</View>

							{/* NUMBER OF TREATMENT */}
							{
								treatmentValue.treatmentDateType && (
									<View style={{ gap: 4, width: "100%" }}>
										<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Number of treatment</Text>

										<Pressable
											value={treatmentValue.treatmentNumberOfDay}
											onPress={() =>setDaysToggle(true)}
											keyboardType="numeric"
											style={{ ...style.inputTextStyle, backgroundColor: "#fafafa" }}
										>
											<TextInput editable={false} style={{ fontSize: 14, color: "#2b2b2b" }}>{treatmentValue.treatmentNumberOfDay ? treatmentValue.treatmentNumberOfDay : "Number of day"}</TextInput>
										</Pressable>
										{daysToggle && (
											<View>
												{
												daysPerSelection.filter((val) => val.type === treatmentValue.treatmentDateType).map((val, idx) => (
														<React.Fragment key={idx}>
															{[...Array(val.number)].map((_, idx) => (
																<Text
																	key={`${val.type}-${idx + 1}`}
																	onPress={() => {
																		setTreatmentValue({
																			...treatmentValue,
																			treatmentNumberOfDay: idx + 1,
																		});
																		setDaysToggle(false);
																	}}
																>
																	{idx + 1}
																</Text>
															))}
														</React.Fragment>
													))}
											</View>
										)}
									</View>
								)
							}

							{/* Date start */}
							<View style={{ gap: 4, width: "100%" }}>
								<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Select starting date</Text>

								{
									showPicker && (
										<DateTimePicker
											mode="date"
											display='spinner'
											value={date}
											onChange={onChangeDate}
											maximumDate={moment().add(5, 'months').endOf('month').toDate()} // Set maximumDate to 5 months from now
											minimumDate={currentDate.toDate()} // Set the minimumDate to the previous day
											androidMode="calendar"
											{...(Platform.OS === 'ios' && { datePickerModeAndroid: 'spinner' })}
											{...(Platform.OS === 'ios' && { maximumDate: moment().add(5, 'months').endOf('month').toDate() })}
											{...(Platform.OS === 'android' && { minDate: moment().startOf('month').toDate() })}
											{...(Platform.OS === 'android' && { maxDate: moment().add(5, 'months').endOf('month').toDate() })}
											{...(Platform.OS === 'android' && { minDate: moment().toDate() })}
										/>
									)
								}

								{
									!showPicker && (
										<Pressable
											style={{ width: '100%' }}
											onPress={handleAppointmentStart}
										>
											<TextInput
												value={dateRef.current}
												editable={false}
												style={{ ...style.inputTextStyle, paddingLeft: 20, backgroundColor: "#fafafa" }}
												onChangeText={onChangeText}
												placeholder={"Select Appointment Date"}
											/>
										</Pressable>
									)
								}
							</View>
						</View>
					</View>


					{/* Payment Info */}
					<View style={{ marginTop: 20, borderTopWidth: 1, paddingTop: 10, borderTopColor: "#ccc" }}>
						<Text style={{ marginVertical: 10, fontWeight: "bold", color: "#3f3f46" }}>Payment Information</Text>

						<View style={{ gap: 10, paddingHorizontal: 8 }}>

							{/* Payment Type */}
							<View style={{ gap: 4, width: "100%" }}>

								<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Payment Type</Text>

								<Pressable style={{ ...style.subDropdownStyle }} onPress={() => setPaymentToggle(!paymentToggle)}>
									<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingHorizontal: 18, paddingVertical: 8, }}>
										<Text style={{ fontSize: 14, color: "#2b2b2b",textTransform:'capitalize' }}>{paymentType ? paymentType : "Select payment type"}</Text>
										<AntDesign name={paymentToggle ? "down" : "up"} color="#2b2b2b" />
									</View>
								</Pressable>

								{
									paymentToggle && (
										<View style={{ width: "100%", borderWidth: 1, borderColor: "#e4e4e7" }}>
											<Text onPress={() => {
												setPaymentType("full-payment");
												setPatientHMO({ ...patientHMO, hmoId: "", hmoName: "", isShow: false })
												setPaymentToggle(false);
											}}
												style={{ width: "100%", paddingVertical: 10, textAlign: 'center', fontSize: 14, textTransform: 'capitalize' }}
											>
												Full-Payment
											</Text>
											{
												totalAmount > 7000 && installment.length < 1 && (
													<Text onPress={() => {
														setPaymentType("installment");
														setPatientHMO({ ...patientHMO, hmoId: "", hmoName: "", isShow: false })
														setPaymentToggle(false);
													}}
														style={{ width: "100%", paddingVertical: 10, textAlign: 'center', fontSize: 14, textTransform: 'capitalize' }}
													>
														Installment
													</Text>
												)
											}
											{
												hmoList.length > 0 && (
													<Text onPress={() => {
														setPaymentType("hmo");
														setPaymentToggle(false);
													}}
														style={{ width: "100%", paddingVertical: 10, textAlign: 'center', fontSize: 14, textTransform: 'capitalize' }}
													>
														HMO
													</Text>
												)
											}
										</View>
									)
								}
							</View>
							{/* HMO */}
							{
								paymentType === "hmo" && (
									<View style={{ gap: 4, width: "100%" }}>
										<Text style={{ fontSize: 12, color: "#4d4d4d", fontWeight: "500" }}>Select HMO</Text>

										<Pressable style={{ ...style.subDropdownStyle }} onPress={() => setPatientHMO(prev => ({ ...patientHMO, isShow: !prev.isShow }))}>
											<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingHorizontal: 18, paddingVertical: 8, }}>
												<Text style={{ fontSize: 14, color: "#2b2b2b" }}>{patientHMO.hmoName ? patientHMO.hmoName : "Select payment type"}</Text>
												<AntDesign name={patientHMO.isShow ? "down" : "up"} color="#2b2b2b" />
											</View>
										</Pressable>

										{
											patientHMO.isShow && (
												<View style={{ width: "100%", height: "auto", borderWidth: 1, borderColor: "#e4e4e7" }}>
													{
														hmoList.map((val, idx) => (
															<Text key={idx} onPress={() => {
																setPatientHMO({ ...patientHMO, hmoName: val.card, hmoId: val.insuranceId, isShow: false })
															}}
																style={{ width: "100%", paddingVertical: 8, textAlign: 'center', fontSize: 12, textTransform: 'capitalize' }}
															>
																{val.card}
															</Text>
														))
													}
												</View>
											)
										}
									</View>
								)
							}

							{/* PAYMENT AMOUNT */}
							<View style={{ gap: 4, width: "100%" }}>
								<Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Total Amount</Text>
								<TextInput
									value={`Php. ${totalAmount.toLocaleString()}`}
									editable={false}
									style={{ ...style.inputTextStyle, backgroundColor: "#fafafa", paddingLeft: 20 }}
								/>
							</View>

						</View>
					</View>


					<View style={{ width: "100%", display: "flex", flexDirection: 'row', gap: 10 , paddingTop: 15}}>
						<Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#ed6868", color: "#fff", borderRadius: 6 }} onPress={() => setModal(false)}>Cancel</Text>
						<Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#06b6d4", color: "#fff", borderRadius: 6 }} onPress={handleSubmitButton}>Confirm</Text>
					</View>
					<Toast />
				</ScrollView>

			</View >
		</View >
	);
}

export default TreatmentModal;

const style = {
	inputTextStyle: {
		borderColor: "#e6e6e6",
		borderWidth: 1, padding: 4,
		borderRadius: 4, paddingLeft: 10
	},
	subDropdownStyle: {
		width: '100%',
		backgroundColor: "#fff",
		justifyContent: "space-between",
		flexDirection: "row", width: "100%", alignItems: "center",
		borderWidth: 1,
		borderColor: "#e6e6e6"
	},
}