import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Services from './Services';
import Schedule from './Schedule';
import Dentist from './Dentist';
import Payment from './Payment';
import Review from './Review';
import { useDispatch, useSelector } from 'react-redux';

function index({ dispatch }) {
	const Stack = createNativeStackNavigator();
	const save = useDispatch();
	const { patient } = useSelector((state) => { return state.patient });
	const services = useSelector((state) => { return state.services });
	const fee = useSelector((state) => { return state.fee.paymentFee });
	const [appointmentDetails, setAppointmentDetails] = useState({
		patient: patient?.patientId,
		dentist: '',
		dentalServices: [],
		date: new Date(),
		timeStart: '',
		timeEnd: '',
		totalAmount: fee?.status === "AVAILABLE" ? fee?.price : 0.00,
		timeSubmitted: '',
		method: '',
		type: '',
		totalServiceTime: '',
		numberOfMonths: 0
	});

	return (
		<Stack.Navigator initialRouteName='Services'>
			<Stack.Screen name='Services' options={{ headerTitle: 'Step 1 of 5' }}>
				{props => <Services appointmentDetails={appointmentDetails} setAppointmentDetails={setAppointmentDetails} {...props} />}
			</Stack.Screen>
			<Stack.Screen name='Schedule' options={{ headerTitle: 'Step 3 of 5' }}>
				{props => <Schedule appointmentDetails={appointmentDetails} setAppointmentDetails={setAppointmentDetails} {...props} />}
			</Stack.Screen>
			<Stack.Screen name='Dentist' options={{ headerTitle: 'Step 2 of 5' }}>
				{props => <Dentist appointmentDetails={appointmentDetails} setAppointmentDetails={setAppointmentDetails} {...props} />}
			</Stack.Screen>
			<Stack.Screen name='Payment' options={{ headerTitle: 'Step 4 of 5' }}>
				{props => <Payment appointmentDetails={appointmentDetails} setAppointmentDetails={setAppointmentDetails} {...props} />}
			</Stack.Screen>
			<Stack.Screen name='Review' options={{ headerTitle: 'Step 5 of 5' }}>
				{props => <Review appointmentDetails={appointmentDetails} {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	)
}

export default index