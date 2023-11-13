import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  Text,
  Image,
  ScrollView,
  Pressable,
  FlatList,
  TouchableHighlight,
  BackHandler,
} from 'react-native';
import { styles } from '../../style/styles';
import moment from 'moment';
import AppointmentCard from '../../components/AppointmentCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnnouncement } from '../../redux/action/AnnouncementAction';
import { fetchServices } from '../../redux/action/ServicesAction';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5';
import { fetchDentists } from '../../redux/action/DentistAction';
import { cancelAppointment } from '../../redux/action/AppointmentAction';
import * as io from 'socket.io-client';
import { SOCKET_LINK } from '../../config/APIRoutes';
import UpdateModal from '../../components/UpdateModal';

import Carousel from 'react-native-reanimated-carousel';

// New array added
const images = [
  require('../../assets/announcements/a1.png'),
  require('../../assets/announcements/a2.png'),
  require('../../assets/announcements/a3.png'),
  require('../../assets/announcements/a4.png'),
  require('../../assets/announcements/a5.png'),
];

const socket = io.connect(SOCKET_LINK);

const Home = React.memo(({ navigation, setAppointmentId, setSideNavShow }) => {
  const dispatch = useDispatch();
  const { height, width } = Dimensions.get('screen');
  const { patient } = useSelector((state) => state.patient);
  const { appointment } = useSelector((state) => state.appointment);
  const { announcement } = useSelector((state) => state.announcement);
  const { services } = useSelector((state) => state.services);
  const { dentists } = useSelector((state) => state.dentist);
  const [modal, setModalShow] = useState({
    id: '',
    isShow: false,
  });
  const [updateSchedule, setUpdateSchedule] = useState({
    data: null,
    isShow: false,
  });

  const currentDate = moment(new Date()).format('LL');
  const filteredTodaysAppointment = appointment.slice();
  const todaysAppointment = filteredTodaysAppointment.filter((val) => {
    return (
      moment(val.appointmentDate, 'YYYY-MM-DD').isSame(moment(), 'day') &&
      (val.status === 'APPROVED' ||
        val.status === 'PROCESSING' ||
        val.status === 'TREATMENT') &&
      val.patient.patientId === patient?.patientId
    );
  });

  const upcomingFilteredList = appointment.slice();
  const upcomingAppointment = upcomingFilteredList
    .filter((val) => {
      return (
        !moment(val.appointmentDate, 'YYYY-MM-DD').isSame(moment(), 'day') &&
        val.patient.patientId === patient?.patientId &&
        (val.status === 'PENDING' || val.status === 'TREATMENT' || val.status === 'APPROVED')
      );
    })
    .map((val) => {
      return {
        ...val,
        typeAppointment: 'upcoming',
      };
    });

  const viewHandleButton = (value) => {
    setAppointmentId(value);
    navigation.navigate('Summary');
  };

  const handleBackPress = () => {
    // Disable back button functionality
    return true;
  };

  useEffect(() => {
    dispatch(fetchAnnouncement());
    dispatch(fetchServices());
    dispatch(fetchDentists());
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Clean up the event listener when the component is unmounted
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={{
        padding: 10,
        marginRight: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        columnGap: 5,
        backgroundColor: '#0891b2',
        borderRadius: 10,
        ...styles.shadow,
      }}
    >
      <FontAwesomeIcons name="teeth-open" size={25} color="#fff" />
      <Text style={{ textTransform: 'capitalize', fontSize: 10, color: 'white', fontWeight: 'bold' }}>
        {item.type}
      </Text>
    </View>
  );

  const deleteButtonAppointment = () => {
    dispatch(cancelAppointment(modal.id));
    setModalShow({ ...modal, id: '', isShow: false });
  }


  const Modal = React.memo(() => {

    return (
      <View
        style={{
          width: '100%',
          height: height,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'absolute',
          top: 0,
          zIndex: 500,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ width: 300, height: 150, backgroundColor: 'white', padding: 10, borderRadius: 10, ...styles.shadow }}>
          <Text style={{ fontSize: 16, textAlign: 'center' }}>Are you sure you want to cancel this Appointment?</Text>
          <View
            style={{
              width: '100%',
              height: 'auto',
              marginTop: 25,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              columnGap: 5,
            }}
          >
            <TouchableHighlight
              style={{
                flexGrow: 1,
                paddingVertical: 10,
                borderColor: '#06b6d4',
                borderWidth: 1,
                alignItems: 'center',
                borderRadius: 20,
              }}
              onPress={() => setModalShow({ ...modal, id: '', isShow: false })}
            >
              <Text>No</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                flexGrow: 1,
                paddingVertical: 10,
                backgroundColor: '#06b6d4',
                alignItems: 'center',
                borderRadius: 20,
              }}
              onPress={deleteButtonAppointment}
            >
              <Text style={{ color: '#fff' }}>Yes</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  });

  return patient && appointment && announcement && services && dentists ? (
    <>
      {modal.isShow && <Modal />}
      {updateSchedule.isShow && <UpdateModal data={updateSchedule} setData={setUpdateSchedule} />}
      <View style={{ ...styles.containerGray, height: height, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column' }}>
        <View style={{ width: '100%', backgroundColor: '#155e75', height: 30 }}></View>
        {/* Header */}
        <View
          style={{
            width: '100%',
            backgroundColor: '#0891b2',
            height: 'auto',
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >

          {/* Left Side*/}
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={() => setSideNavShow(true)}>
              <EntypoIcon name="menu" size={30} color="#fff" />
            </Pressable>

            <View style={{ marginLeft: 10, display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              {/* <Image source={{ uri: patient.profile }} style={{ width: 35, height: 35, borderRadius: 100 }} /> */}
              <View style={{ gap: 2, flexDirection: 'row' }}>
                <Text style={{ color: '#fff', fontSize: 15 }}>Hello, </Text>
                <Text style={{ color: '#fff', fontWeight: '500', fontSize: 15 }}>{patient.firstname}</Text>
              </View>
            </View>
          </View>


          {/* Right Side */}
          <View style={{ height: 'auto', width: 'auto', padding: 5, position: 'relative' }}>
            <Ionicons name="notifications" color="#fff" size={25} />
            <Text style={{ backgroundColor: '#e62e00', color: 'white', width: 20, height: 20, position: 'absolute', right: 0, textAlign: 'center', borderRadius: 100 }}>1</Text>
          </View>

        </View>
        
        {/* Body */}
        <View
          style={{
            width: '100%',
            height: 250,
            backgroundColor: 'white',
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            rowGap: 10,
            position: 'relative',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          {/**ADDED CAROUSEL LOGIC */}
          <Carousel
            loop
            width={width}
            height={width / 2}
            autoPlay={true}
            data={images}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => ('current index: ', index)}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  style={{
                    width: '80%',
                    height: '100%',
                    resizeMode: 'contain',
                    borderRadius: 20,
                  }}
                  source={item}
                />
              </View>
            )}
          />
        </View>
        <ScrollView>
          <View style={{ height: 'auto', width: '100%', padding: 10, display: 'flex', gap: 5, marginTop: 5 }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#3f3f46' }}>Services</Text>
            <FlatList data={services.sort()} renderItem={renderItem} keyExtractor={(item) => item.serviceId} horizontal={true} showsHorizontalScrollIndicator={false} />
          </View>
          <View style={{ height: 'auto', width: '100%', padding: 10, display: 'flex', gap: 5, marginTop: 0 }}>
            <AppointmentCard title="Today's Appointment" dataList={todaysAppointment} bgColor="#fff" borderColor="#06b6d4" fontColor="#10b981" subColor="#06b6d4" showDate={true} viewEvent={viewHandleButton} />
            <AppointmentCard title="Upcoming Appointment" dataList={upcomingAppointment} bgColor="#fff" borderColor="#06b6d4" fontColor="#10b981" subColor="#06b6d4" showDate={true} viewEvent={viewHandleButton} setModal={setModalShow} modal={modal} navigate={navigation} update={updateSchedule} setUpdateSchedule={setUpdateSchedule} />
            {/* <AppointmentCard title="Pending Appointment" dataList={pendingAppointment} borderColor="#f59e0b" bgColor="#fff" fontColor="#10b981" subColor="#06b6d4" showDate={true} viewEvent={viewHandleButton} setModal={setModalShow} modal={modal} /> */}
            <View style={{ height: 150 }}></View>
          </View>
        </ScrollView>
      </View>
    </>
  ) : null;
});

export default Home;