import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup/index';
import Patient from './screens/Patient Screen/index';
import Dentist from './screens/Dentist Screen/index';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import Sample from './screens/Sample';
import React from 'react';
import 'react-native-gesture-handler';
import { StatusBar, } from 'react-native'; // Add this line to import StatusBar
import ForgotPassword from './screens/Forgot Password/index';


function App() {
  const Stack = createNativeStackNavigator();
  StatusBar.setBackgroundColor('#CCCC'); // Replace '#fff' with your desired color

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Forgot Password" component={ForgotPassword} />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="Patient" component={Patient} options={{ headerShown: false, }} />
          <Stack.Screen name="Dentist" component={Dentist} options={{ headerShown: false, }} />
          <Stack.Screen name="Sample" component={Sample} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
export default App;