import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, Image, Alert } from 'react-native';
import { styles } from '../../../style/styles';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Button from '../../../components/Button';

function Dentist({ navigation, appointmentDetails, setAppointmentDetails }) {
	const { height } = Dimensions.get("screen");
	const { dentists } = useSelector((state) => { return state.dentist });
	const [selectedDentist, setSelectedDentist] = useState(null);

	const dentistSubmitButton = (value) => {
		if (!selectedDentist) return Alert.alert("Please select a dentist");

		setAppointmentDetails({
			...appointmentDetails,
			dentist: value
		});
		navigation.navigate('Schedule');
	}

	return (
		<>
			<ScrollView style={{ maxHeight: height, padding: 20, flexGrow: 1, gap: 10, flexDirection: 'column', position: 'relative', zIndex: -50 }}>
				<Text style={{ fontSize: 20, fontWeight: '500', color: "#3f3f46" }}>Select a dentist</Text>
				<View style={{ flex: 1, flexDirection: 'column', rowGap: 15, ...styles.shadow, marginTop: 10 }}>
					{
						dentists.map((val, idx) => (
							<Pressable key={idx} style={{ borderWidth: 1.2, borderColor: selectedDentist === val.dentistId ? '#06b6d4' : '#f2f2f2', width: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 15, elevation: 1, shadowRadius: 8, shadowOffset: .2, flex: 1, flexDirection: 'row', columnGap: 10, justifyContent: 'flex-start', alignItems: 'center', borderRadius: 10 }} onPress={() => setSelectedDentist(val.dentistId)}>
								<Image source={{ uri: val.profile }} style={{ width: 60, height: 60, borderRadius: 30, }} />
								<View>
									<Text style={{ fontSize: 17, textTransform: 'capitalize', fontWeight: '500', color: '#3f3f46' }}>Dr. {val.fullname}</Text>
									<Text style={{ color: '#a1a1aa', fontSize: 13 }}>{val.specialty}</Text>
								</View>
							</Pressable>
						))
					}
				</View>
			</ScrollView>
			<View style={{ width: '100%', padding: 20, position: 'relative' }}>
				<Button title='Continue' bgColor='#06b6d4' textColor='#fff' onPress={() => dentistSubmitButton(selectedDentist)} />
			</View>
		</>
	)
}

export default React.memo(Dentist);