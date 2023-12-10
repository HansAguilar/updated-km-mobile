import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  StatusBar,
  SafeAreaView
} from 'react-native';
import { styles } from '../../style/styles';
import moment from 'moment';
import AppointmentCard from '../../components/AppointmentCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices } from '../../redux/action/ServicesAction';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchDentists } from '../../redux/action/DentistAction';
import { cancelAppointment } from '../../redux/action/AppointmentAction';
import * as io from 'socket.io-client';
import { SOCKET_LINK } from '../../config/APIRoutes';
import UpdateModal from '../../components/UpdateModal';

import Carousel from 'react-native-reanimated-carousel';

const { height, width } = Dimensions.get('screen');
const statusbarHeight = StatusBar.currentHeight;

const Home = React.memo(({ navigation, setAppointmentId, setSideNavShow }) => {
  const dispatch = useDispatch();

  const { patient } = useSelector((state) => state.patient);
  const { appointment } = useSelector((state) => state.appointment);
  const { announcement } = useSelector((state) => state.announcement);
  const { services } = useSelector((state) => state.services);
  const notificationCounter = useSelector((state) => state.notification?.notification?.filter((val) => val.status === "UNREAD"));
  const images = announcement?.map((val) => val.picture);
  const [modal, setModalShow] = useState({ id: '', isShow: false });
  const [updateSchedule, setUpdateSchedule] = useState({ data: null, isShow: false, });
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // console.log(appointment)
  const currentDate = moment(new Date()).format('LL');
  
  const todaysAppointment = useMemo(()=>{
    const tempAppointment = appointment.slice();
    const result = tempAppointment.filter((val) => {
      return (
        moment(val.appointmentDate, 'YYYY-MM-DD').isSame(moment(), 'day') &&
        (val.status === 'APPROVED' ||
          val.status === 'PROCESSING' ||
          val.status === 'TREATMENT') &&
        val.patient.patientId === patient?.patientId
      );
    });
    return result;
  },[appointment])


  const upcomingAppointment = useMemo(() => {
    const tempAppointment = appointment.slice();
    const result = tempAppointment
      .filter((val) => (
        !moment(val.appointmentDate, 'YYYY-MM-DD').isSame(moment(), 'day') &&
        val.patient.patientId === patient?.patientId &&
        (val.status === "PENDING" || val.status === "TREATMENT" || val.status === "APPROVED")
      ))
      .map((val) => {
        return { ...val, typeAppointment: 'upcoming' };
      });
    return result;
  }, [appointment]);


  const viewHandleButton = (value) => {
    setAppointmentId(value);
    navigation.navigate('Summary');
  };

  const handleBackPress = () => { return true; };

  const handleShowPopUp = (item) => {
    setSelectedItem(item);
    setShowPopUp(prev => !prev);
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  const renderItem = ({ item }) => {
    let displayPrice;
    if (item.price >= 1000) {
      let cleanPrice = item.price.toString();
      displayPrice = `${cleanPrice.substring(0, cleanPrice.length - 3)},${cleanPrice.substring(cleanPrice.length - 3)}`;
    }
    else {
      displayPrice = item.price;
    }

    return (
      <View style={{
        padding: 10, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
        backgroundColor: '#0ab1db', borderRadius: 6, gap: 5, marginRight: 12, elevation: .8, shadowRadius: 6, shadowOpacity: .8
      }}>
        <MaterialCommunityIcons name="tooth-outline" size={25} color="#fff" />
        <View>
          <Text style={{ textTransform: 'capitalize', fontSize: 14, color: '#fff', fontWeight: '500', letterSpacing: 0.2 }}>
            {item.type}
          </Text>
          <Text style={{ textTransform: 'capitalize', fontSize: 12, color: '#fff', fontWeight: '400' }}>
            ₱ {displayPrice}
          </Text>
        </View>
      </View>
    );
  }

  const deleteButtonAppointment = () => {
    dispatch(cancelAppointment(modal.id));
    setModalShow({ ...modal, id: '', isShow: false });
  }

  {/* //~ CANCEL APPOINTMENT */ }
  const Modal = React.memo(() => {
    return (
      <View style={{
        width: '100%', height: height, backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute',
        top: 0, zIndex: 90, display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}
      >
        <View style={{ width: 300, backgroundColor: 'white', padding: 15, borderRadius: 4, ...styles.shadow, alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', gap: 6 }}>
            <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#ff6666" style={{ backgroundColor: '#ffe6e6', borderRadius: 50, padding: 8 }} />
            <Text style={{ fontWeight: '600', paddingTop: 14, color: "#3f3f46", fontSize: 16 }}>CANCEL APPOINTMENT?</Text>
          </View>

          <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 10, marginBottom: 20, color: "#b3b3b3" }}>Are you sure you want to cancel this Appointment?</Text>
          <View
            style={{
              width: '100%',
              height: 'auto',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopColor: '#d9d9d9', borderTopWidth: 1, paddingTop: 15, paddingBottom: 10, gap: 6
            }}
          >
            <TouchableHighlight
              style={{
                flexGrow: 1,
                paddingVertical: 10,
                borderColor: '#06b6d4',
                borderWidth: 1,
                alignItems: 'center',
                borderRadius: 4,

              }}
              onPress={() => setModalShow({ ...modal, id: '', isShow: false })}
            >
              <Text style={{ color: "#06b6d4", fontWeight: '500' }}>CANCEL</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                flexGrow: 1,
                paddingVertical: 10,
                backgroundColor: '#06b6d4',
                alignItems: 'center',
                borderRadius: 4,
              }}
              onPress={deleteButtonAppointment}
            >
              <Text style={{ color: '#fff', fontWeight: '500' }}>CONFIRM</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  });
  {/* //~ CANCEL APPOINTMENT */ }


  return patient && (
    <>
      {modal.isShow && <Modal />}
      {updateSchedule.isShow && <UpdateModal data={updateSchedule} setData={setUpdateSchedule} setShowPopUp={setShowPopUp} />}
      <SafeAreaView style={{ ...styles.containerGray, height: height, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingTop: statusbarHeight }}>

        {/* //~ Header */}
        <View style={{ width: '100%', backgroundColor: '#06b6d4', padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
          {/* //~ Header */}


          {/* //~ HAMBURGER AND GREET */}
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={() => setSideNavShow(true)}>
              <EntypoIcon name="menu" size={30} color="#fff" />
            </Pressable>

            <View style={{ marginLeft: 10, display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <View style={{ gap: 2, flexDirection: 'row' }}>
                <Text style={{ color: '#fff', fontSize: 15 }}>Hello, </Text>
                {
                  patient.firstname.length > 15 ?
                    <Text style={{ color: '#fff', fontWeight: '500', fontSize: 15 }}>{patient.firstname.charAt(0).toUpperCase() + patient.firstname.substring(0, 15) + "..."}</Text>
                    :
                    <Text style={{ color: '#fff', fontWeight: '500', fontSize: 15 }}>{patient.firstname.charAt(0).toUpperCase() + patient.firstname.substring(1)}</Text>
                }
              </View>
            </View>
          </View>
          {/* //~ HAMBURGER AND GREET */}


          {/* //~ NOTIFICATION */}
          <Pressable style={{ height: 'auto', width: 'auto', padding: 5, position: 'relative' }} onPress={() => { navigation.navigate("Notification") }}>
            <Ionicons name="notifications" color="#fff" size={25} />
            {
              notificationCounter?.length > 0 &&
              <Text style={{ backgroundColor: '#ef4444', color: 'white', width: 10, height: 10, position: 'absolute', top: 5, right: 5, textAlign: 'center', borderRadius: 100 }}></Text>
            }
          </Pressable>
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
          {
            images.length > 0 && <Carousel
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
                    source={{ uri: item }}
                  />
                </View>
              )}
            />
          }
        </View>
        {/* //~ CAROUSEL CONTAINER */}


        {/* //~ DASHBOARD CONTAINER */}
        <ScrollView>
          <View style={{ backgroundColor: '#f2f2f2', padding: 10, flexDirection: 'column', gap: 16 }}>

            {/* //~ FEATURED SERVICES */}
            <View style={{ height: 'auto', width: '100%', display: 'flex', gap: 8 }}>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: '500', letterSpacing: 0.1, color: '#3f3f46' }}>Services</Text>
                {/* <Pressable onPress={() => { navigation.navigate("Notification") }}>
                  <SimpleLineIcons name="arrow-right-circle" color="#404040" size={15} />
                </Pressable>
                <Text style={{ fontSize: 13, fontWeight: '500', color: '#08abc4', marginLeft: 'auto', marginRight: 16 }}>See All</Text> */}
              </View>

              <FlatList data={services.sort()} renderItem={renderItem} keyExtractor={(item) => item.serviceId} horizontal={true} showsHorizontalScrollIndicator={false} />
            </View>
            {/* //~ FEATURED SERVICES */}

            <View style={{ height: 'auto', width: width, display: 'flex', gap: 10, }}>
              <AppointmentCard title="Today's Appointment" dataList={todaysAppointment} bgColor="#fff" borderColor="#e6e6e6" fontColor="#10b981" subColor="#bfbfbf" showDate={true} viewEvent={viewHandleButton} />
              
              <AppointmentCard title="Upcoming Appointment" dataList={upcomingAppointment} bgColor="#fff" borderColor="#e6e6e6" fontColor="#10b981" subColor="#bfbfbf" showDate={true} viewEvent={viewHandleButton} setModal={setModalShow} modal={modal} navigate={navigation} update={updateSchedule} setUpdateSchedule={setUpdateSchedule} showPopUp={showPopUp} handleShowPopUp={handleShowPopUp} selectedItem={selectedItem} />
              {/* <AppointmentCard title="Pending Appointment" dataList={pendingAppointment} borderColor="#f59e0b" bgColor="#fff" fontColor="#10b981" subColor="#06b6d4" showDate={true} viewEvent={viewHandleButton} setModal={setModalShow} modal={modal} /> */}
              <View style={{ height: 150 }}></View>
            </View>

          </View>
        </ScrollView>
        {/* //~ DASHBOARD CONTAINER */}
      </SafeAreaView>
    </>
  );
});

export default Home;