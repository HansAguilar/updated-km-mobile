import React, { useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Message from './Message';
import MessageRoom from './MessageRoom';

export default function index() {
    const Stack = createNativeStackNavigator();
    const [messageHistory, setMessageHistory] = useState(null);

  return (
    <Stack.Navigator initialRouteName='Message Dashboard'>
        <Stack.Screen name='Message Dashboard' >
                    {props=><Message setMessageHistory={setMessageHistory} {...props}/> }
        </Stack.Screen>

        <Stack.Screen 
            name='Message Room'
            options={({ route }) => ({
            title: route.params.roomId,
            headerShown: false
            })}
        >
            {props=><MessageRoom {...props}/> }
        </Stack.Screen>
    </Stack.Navigator>
  )
}
