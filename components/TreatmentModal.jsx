import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TextInput, Pressable, Picker, Alert } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { useDispatch, useSelector } from 'react-redux';
import AntIcon from "react-native-vector-icons/AntDesign";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { createTreatment } from "../redux/action/AppointmentAction";
import { fetchPayment } from "../redux/action/PaymentAction";
import toastFunction from "../config/toastConfig";
import { Toast } from 'react-native-toast-message/lib/src/Toast';

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
		if (data.dentalServices.length < 0 || !data.startOfTreatment || data.treatmentNumber || data.treatmentType || !data.paymentType) {
			toastFunction("error", "Fill up empty field");
		}
		dispatch(createTreatment(data));
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

	return (
		<View style={{ height: "100%", width: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", position: 'absolute', zIndex: 10, padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<View style={{ width: "100%", height: 600, maxHeight: 600, backgroundColor: "white", padding: 20, borderRadius: 10, zIndex: -10 }}>
				<Text style={{ fontSize: 18, fontWeight: 'bold', color: "#52525b", width: "100%", paddingBottom: 5, borderBottomWidth: 1, borderColor: "gray" }}>Treatment Data</Text>
				<ScrollView style={{ width: "100%", height: "100%", paddingVertical: 15, }}>

					{/* Appointment Info */}
					<Text style={{ marginBottom: 10, fontWeight: "bold", color: "#3f3f46" }}>Appointment Information</Text>
					<View style={{ paddingHorizontal: 10 }}>
						{/* PATIENT NAME */}
						<View style={{ marginBottom: 10 }}>
							<Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Patient Name</Text>
							<TextInput
								value={`${treatmentData.patient.firstname} ${treatmentData.patient.lastname}`}
								editable={false}
								style={{ fontSize: 12, borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 3, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46" }}
							/>
						</View>

						{/* DENTIST NAME */}
						<View style={{ marginBottom: 10 }}>
							<Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Dentist Name</Text>
							<TextInput
								value={`Dr. ${treatmentData.dentist.fullname}`}
								editable={false}
								style={{ fontSize: 12, borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 3, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46" }}
							/>
						</View>

						{/* SERVICES */}
						<View style={{ marginBottom: 10 }}>
							<Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Services</Text>
							<View
								style={{ fontSize: 12, borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 3, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46", width: "100%", display: 'flex', flexWrap: 'wrap', gap: 10, flexDirection: 'row' }}
							>
								{
									dentalServices.map((val, idx) => (
										<View key={idx} style={{ backgroundColor: "#06b6d4", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', columnGap: 8 }}>
											<Text style={{ color: "#fff", }}>{val.name}</Text>
											<Pressable
												style={{ borderColor: "#fff", borderWidth: 1, padding: 1, borderRadius: 20 }}
												onPress={() => {
													setTotalAmount((prev) => prev - val.price)
													setDentalServices(prev => {
														return prev.filter((p) => p.serviceId !== val.serviceId)
													})
												}
												}
											>
												<EntypoIcon name="cross" color="#fff" />
											</Pressable>
										</View>
									))
								}
								<TextInput style={{ flex: 1 }} value={searchService} onChangeText={handleSearchService} />
							</View>
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
									: searchService && suggestion.length < 1 ? <Text>No existing services</Text>
										: <></>
							}
						</View>

						{/* Teeth */}
						<View style={{ marginBottom: 10 }}>
							<Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Teeth</Text>
							<Pressable
								style={{ height: "auto", borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 8, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46", display: "flex", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}
								onPress={() => setToothToggle(true)}
							>
								<Text style={{ fontSize: 12, }}>{selectedTeeth.length > 0 ? `${selectedTeeth.length} tooth selected` : "None"}</Text>
								<AntIcon name='down' size={12} color={"black"} />
							</Pressable>
							{
								toothToggle && (
									<View style={{ height: "auto", width: "100%", display: "flex", justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', flexDirection: "row", gap: 10, paddingVertical: 10, paddingHorizontal: 5 }}>
										{
											toothChart.map((val, idx) => (
												<Text key={idx}
													style={{
														padding: 5,
														backgroundColor: val.isClick ? "#06b6d4" : "#fff",
														color: val.isClick ? "#fff" : "#52525b",
														borderRadius: 5,
														borderWidth: 1,
														borderColor: val.isClick ? "#06b6d4" : "#f4f4f5",
													}}
													onPress={() => selectTeethHandler(idx)}
												>{val.name}</Text>
											))
										}
										<Text key={"none"}
											style={{
												padding: 5,
												backgroundColor: "#fff",
												color: "#52525b",
												borderRadius: 5,
												borderWidth: 1,
												borderColor: "#f4f4f5",
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
							{selectedTeeth.length > 0 && toothToggle && <Text style={{ backgroundColor: "#06b6d4", paddingVertical: 6, textAlign: 'center', color: "#fff", borderRadius: 5 }} onPress={() => setToothToggle(false)}>Done</Text>}
						</View>
					</View>

					{/* Treatment Info */}
					<Text style={{ marginVertical: 10, fontWeight: "bold", color: "#3f3f46" }}>Treatment Schedule</Text>
					<View style={{ paddingHorizontal: 10 }}>

						{/* NUMBER OF TREATMENT */}
						<View style={{ marginBottom: 10 }}>
							<Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Number of treatment</Text>
							<TextInput
								value={treatmentValue.treatmentNumberOfDay}
								onChangeText={handleTreatment}
								keyboardType="numeric"
								style={{ fontSize: 12, borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 3, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46" }}
							/>
						</View>

						{/* DATE TYPE */}
						<View style={{ marginBottom: 10 }}>
							<Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Treatment Date Type</Text>
							<Pressable
								style={{ height: "auto", borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 8, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46", display: "flex", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}
								onPress={() => setTreatmentDateListToggle(true)}
							>
								<Text style={{ fontSize: 12, textTransform: 'capitalize' }}>{treatmentValue.treatmentDateType ? treatmentValue.treatmentDateType : "Select treatment type"}</Text>
								<AntIcon name='down' size={12} color={"black"} />
							</Pressable>
							{
								treatmentDateListToggle && (
									<View style={{ width: "100%", height: "auto", borderWidth: 1, borderColor: "#e4e4e7" }}>
										{
											treatmentDateList.map((val, idx) => (
												<Text key={idx} onPress={() => {
													setTreatmentValue({ ...treatmentValue, treatmentDateType: val })
													setTreatmentDateListToggle(false);
												}} style={{ width: "100%", paddingVertical: 8, textAlign: 'center', fontSize: 12, textTransform: 'capitalize' }}>{val}</Text>
											))
										}
									</View>
								)
							}
						</View>

						{/* Date start */}
						<View style={{ marginBottom: 10 }}>
							<Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Select starting date</Text>
							{
								showPicker && (
									<DateTimePicker
										mode="date"
										display='spinner'
										value={date}
										onChange={onChangeDate}
										maximumDate={moment().endOf('year').toDate()}
										minimumDate={moment().add(1, 'day').toDate()} // Exclude the current day
										androidMode="calendar"
										{...(Platform.OS === 'ios' && { datePickerModeAndroid: 'spinner' })}
										{...(Platform.OS === 'ios' && { maximumDate: moment().endOf('year').toDate() })}
										{...(Platform.OS === 'android' && { minDate: moment().startOf('month').toDate() })}
										{...(Platform.OS === 'android' && { maxDate: moment().endOf('year').toDate() })}
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
											style={{ fontSize: 12, borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 3, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46" }}
											onChangeText={onChangeText}
											placeholder={"Select Appointment Date"}
										/>
									</Pressable>
								)
							}
						</View>
					</View>

					{/* Payment Info */}
					<Text style={{ marginVertical: 10, fontWeight: "bold", color: "#3f3f46" }}>Payment Information</Text>
					<View style={{ paddingHorizontal: 10 }}>

						{/* Payment Type */}
						<View style={{ marginBottom: 10 }}>
							<Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Payment Type</Text>
							<Pressable
								style={{ height: "auto", borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 8, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46", display: "flex", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}
								onPress={() => setPaymentToggle(true)}
							>
								<Text style={{ fontSize: 12, textTransform: 'capitalize' }}>{paymentType ? paymentType : "Select payment type"}</Text>
								<AntIcon name='down' size={12} color={"black"} />
							</Pressable>
							{
								paymentToggle && (
									<View style={{ width: "100%", height: "auto", borderWidth: 1, borderColor: "#e4e4e7" }}>
										<Text onPress={() => {
											setPaymentType("full-payment");
											setPatientHMO({ ...patientHMO, hmoId: "", hmoName: "", isShow: false })
											setPaymentToggle(false);
										}}
											style={{ width: "100%", paddingVertical: 8, textAlign: 'center', fontSize: 12, textTransform: 'capitalize' }}
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
													style={{ width: "100%", paddingVertical: 8, textAlign: 'center', fontSize: 12, textTransform: 'capitalize' }}
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
													style={{ width: "100%", paddingVertical: 8, textAlign: 'center', fontSize: 12, textTransform: 'capitalize' }}
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
								<View style={{ marginBottom: 10 }}>
									<Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Select HMO</Text>
									<Pressable
										style={{ height: "auto", borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 8, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46", display: "flex", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}
										onPress={() => setPatientHMO({ ...patientHMO, isShow: true })}
									>
										<Text style={{ fontSize: 12, textTransform: 'capitalize' }}>{patientHMO.hmoName ? patientHMO.hmoName : "Select payment type"}</Text>
										<AntIcon name='down' size={12} color={"black"} />
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
						<View style={{ marginBottom: 10 }}>
							<Text style={{ fontSize: 10, fontWeight: "bold", color: "#3f3f46", marginBottom: 5 }}>Total Amount</Text>
							<TextInput
								value={`Php. ${totalAmount.toLocaleString()}`}
								editable={false}
								style={{ fontSize: 12, borderWidth: 0.5, borderColor: "#e4e4e7", paddingVertical: 3, paddingHorizontal: 10, backgroundColor: "#fafafa", color: "#3f3f46" }}
							/>
						</View>

					</View>

					<View style={{ width: "100%", height: "auto", display: "flex", flexDirection: 'row', columnGap: 10 }}>
						<Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#ef4444", color: "#fff", borderRadius: 8 }} onPress={() => setModal(false)}>Cancel</Text>
						<Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#06b6d4", color: "#fff", borderRadius: 8 }} onPress={handleSubmitButton}>Submit</Text>
					</View>
					<View style={{ width: "100%", height: 20 }}></View>
				</ScrollView>

			</View>
		</View>
	);
}

export default TreatmentModal;