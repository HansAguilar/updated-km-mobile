import React from 'react';
import { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountEmail from "./AccountEmail";
import Verify from "./VerifyOTP";
import Password from "./ChangePassword";

function Index({ navigation }) {
  const Stack = createNativeStackNavigator();
  const [pin, setPin] = useState(null);
  const [recoveryData, setRecoveryData] = useState({
    email: "",
  });

  return (
    <>
      <Stack.Navigator initialRouteName="Email">
        <Stack.Screen name="Email" options={{ headerShown: false }}>
          {props => <AccountEmail pin={pin} setPin={setPin} recoveryData={recoveryData} setRecoveryData={setRecoveryData} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Verify" options={{ headerShown: false }}>
          {props => <Verify pin={pin} setPin={setPin} recoveryData={recoveryData} setRecoveryData={setRecoveryData} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Password" options={{ headerShown: false }}>
          {props => <Password recoveryData={recoveryData} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
}


export default React.memo(Index);