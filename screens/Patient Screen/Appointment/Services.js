import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, Pressable, Alert } from 'react-native';
import { styles } from '../../../style/styles';
import axios from 'axios';
import { SERVICES_URL } from '../../../config/APIRoutes';
import Loader from '../../../components/Loader';
import moment, { duration } from 'moment/moment';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Button from '../../../components/Button';
import ToastFunction from '../../../config/toastConfig';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';

const Services = React.memo(({ navigation, appointmentDetails, setAppointmentDetails }) => {
  const { height } = Dimensions.get('screen');
  const [isActive, setActive] = useState({
    idx: [],
    status: false
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const { services } = useSelector((state) => { return state.services });

  const selectServiceEvent = (idx, serviceId) => {
    if (isActive.idx.includes(idx)) {
      const newList = isActive.idx.filter((item) => item !== idx);
      const newSelectedServices = selectedServices.filter((val) => val !== serviceId);
      setActive({ ...isActive, idx: newList });
      setSelectedServices(newSelectedServices);
    } else {
      isActive.idx.push(idx);
      selectedServices.push(serviceId)
      setActive({ ...isActive, status: true });
    }
  };

  const buttonContinue = () => {
    if (selectedServices.length < 1) return Alert.alert("Please fill up empty field");

    const totalAmount = services.reduce((acc, val) => {
      if (selectedServices.includes(val.serviceId)) { return acc + parseInt(val.price); }
      return acc;
    }, 0);
    setAppointmentDetails({ ...appointmentDetails, dentalServices: selectedServices });
    navigation.navigate('Dentist');
  }
  const calculateTotalServiceTime = () => {
    const timeEnd = selectedServices.map((val) => {
      const result = services.filter((service) => {
        return service.serviceId === val;
      }).map((val) => { return val.duration; });
      return result;
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
  return services && (
    <>
      <ScrollView style={{ maxHeight: height, padding: 20, flexGrow: 1, gap: 10, flexDirection: 'column', position: 'relative', zIndex: -50 }}>
        <Toast />
        <View style={{ width: '100%', marginBottom: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: -50 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', }}>Select Services</Text>
          <Text style={{ fontSize: 12, }}>{isActive.idx.length < 1 ? `Empty service` : `${isActive.idx.length} case selected`}</Text>
        </View>
        <View style={{ flex: 1, rowGap: 20, position: 'relative', zIndex: -50 }}>
          {
            services.map((val, idx) => (
              <Pressable style={{ width: '100%', height: 'auto', backgroundColor: '#06b6d4', borderRadius: 10, padding: 20, }} key={idx} onPress={() => { selectServiceEvent(idx, val.serviceId) }}>
                <View style={{ height: 'auto', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 5 }}>
                  <Text style={{ fontSize: 20, textTransform: 'capitalize', fontWeight: 'bold', color: '#fff', }}>{val.type}</Text>
                  <View style={{ width: 20, height: 20, backgroundColor: isActive.idx.includes(idx) && isActive.status ? '#fff' : '#e4e4e7', borderRadius: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    {isActive.idx.includes(idx) && isActive.status && (<AntDesignIcon name='check' size={15} color={'#06b6d4'} />)}
                  </View>
                </View>
                <Text style={{ color: '#fff', fontSize: 12 }}>Total estimation: Php {val.price}</Text>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0e7490', }}>Service time: {val.duration === "01:00:00" ? `${moment.duration(val.duration).asHours()}hr` : `${moment.duration(val.duration).asMinutes()} min`}</Text>
                {/* <View style={{marginTop:10, flex:1, justifyContent:'space-between', alignItems:'center', flexDirection:'row'}}>
                                        <Text style={{color: '#fff', fontSize:12}}>See more</Text>
                                        <AntDesignIcon name='down' size={15} color={'#fff'} />
                                    </View> */}
              </Pressable>
            ))
          }
          {/* <Pressable style={{width:'100%', height:'auto', backgroundColor:'#06b6d4', borderRadius:10, padding:20, }} >
                                    <View style={{height:'auto',  flex:1,justifyContent:'space-between', alignItems:'flex-start', flexDirection:'row', marginBottom:5}}>
                                        <Text style={{fontSize:20, textTransform:'capitalize', fontWeight:'bold', color:'#fff',}}>esf</Text>
                                        <View style={{width:20, height:20, backgroundColor: '#e4e4e7',borderRadius:100, display:'flex', justifyContent:'center', alignItems:'center'}} >
                                            <AntDesignIcon name='check' size={15} color={'#06b6d4'} />
                                        </View>
                                    </View>
                                    <Text style={{color:'#fff', fontSize:12}}>Total estimation: Php 500</Text>
                                    <Text style={{fontSize:10, fontWeight:'bold',color:'#0e7490',}}>Service time: 1hr</Text>
                                </Pressable> */}

        </View>
      </ScrollView>
      <View style={{ width: '100%', padding: 10, position: 'relative' }}>
        <Button title='Continue' bgColor='#06b6d4' textColor='#fff' onPress={buttonContinue} />
      </View>
    </>
  )
})
export default Services