import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Message from './Message';
import MessageRoom from './MessageRoom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientMessage } from '../../../redux/action/MessageAction';
import { Text,  } from 'react-native';
import Loader from '../../../components/Loader';

export default function index() {
  const Stack = createNativeStackNavigator();
  const [messageHistory, setMessageHistory] = useState(null);
  const messages = useSelector((state)=>state?.messages?.message);
  const patient = useSelector((state)=>state.patient.patient)
  const dispatch = useDispatch();

  useEffect(()=>{
      dispatch(fetchPatientMessage(patient.patientId));
  },[])
  
  return (
    <>
      {!messages ? (<Loader loading={true}/>)
      :(
        <Stack.Navigator initialRouteName='Message Dashboard'>
          <Stack.Screen name='Message Dashboard' >
            {props => <Message setMessageHistory={setMessageHistory} {...props} />}
          </Stack.Screen>
    
            <Stack.Screen 
                name='Message Room'
                options={({ route }) => ({
                title: route.params.roomId,
                headerShown: false
                })}
            >
                {props=><MessageRoom messageHistory={messageHistory} {...props}/> }
            </Stack.Screen>
        </Stack.Navigator>
        )
      }
    </>
  )
}
