import React from 'react';
import { useEffect,useState } from 'react';
import { View, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveDentist } from "../../redux/action/DentistAction";
import { fetchAppointment } from "../../redux/action/AppointmentAction";
import { fetchAllPatient } from "../../redux/action/PatientAction";
import { fetchServices } from "../../redux/action/ServicesAction";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./Home";
import Prescription from "./Prescription";
import Details from "./ViewDetails";
import Loader from "../../components/Loader";
import Drawer from "../../components/DentistDrawer";
import PatientHistory from "./PatientHistory";

function Index({navigation}) {
  const dispatch = useDispatch();
  const Stack = createNativeStackNavigator();
  const dentist = useSelector((state)=>{ return state.dentist; });
  const patient = useSelector((state)=>{ return state.patient; });
  const appointment = useSelector((state=>{ return state.appointment }));
  const [isSideNavShow, setSideNavShow]= useState(false);
  const [appointmentId, setAppointmentId] = useState(null);


  const navigateToLink = (link) => navigation.navigate(`${link}`);
  const fetchData = async() =>{
    const token = await AsyncStorage.getItem("token");
    dispatch(fetchAppointment());
    dispatch(fetchAllPatient());
    dispatch(fetchServices())
    dispatch(fetchActiveDentist(token));
  }
  useEffect(()=>{fetchData();},[]);
  return(
   <>
    { (dentist.loading || appointment.loading ) && (<Loader loading={dentist.loading} />) }
    {
      (!dentist.loading  && !appointment.loading &&dentist ) && (
        <>
        <Drawer navigation={navigateToLink} isSideNavShow={isSideNavShow} setSideNavShow={setSideNavShow} />
        
        <Stack.Navigator initialRouteName='Dashboard'>
         <Stack.Screen name='Dashboard' options={{ headerShown: false }}>
           {props => <Home setSideNavShow={setSideNavShow} setAppointmentId={setAppointmentId} {...props} />}
         </Stack.Screen>
         <Stack.Screen name="Prescription">
           {props => <Prescription setSideNavShow={setSideNavShow} {...props} />}
         </Stack.Screen>
         <Stack.Screen name="Details" >
           {props => <Details {...props} />}
         </Stack.Screen>
         <Stack.Screen name="Patient History" >
           {props => <PatientHistory appointmentId={appointmentId} {...props} />}
         </Stack.Screen>
       </Stack.Navigator>
        </>
      ) 
    }
    </>
  );
}
  

export default React.memo(Index);