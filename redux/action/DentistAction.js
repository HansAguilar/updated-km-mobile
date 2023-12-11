import axios from 'axios';
import { FETCH_DENTIST_REQUEST, FETCH_DENTIST_SUCCESS, FETCH_DENTIST_FAILED, LOGIN_DENTIST_SUCCESS, ACTIVE_DENTIST_SUCCESS, ACTIVE_DENTIST_REQUEST, LOGOUT_DENTIST_SUCCESS, UPDATE_DENTIST_INFO_SUCCESS } from '../ActionType';
import { DENTIST_URL } from '../../config/APIRoutes';
import ToastFunction from '../../config/toastConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchDentists = () =>{
    return async(dispatch) =>{
        try {
            const response = await axios.get(`${DENTIST_URL}/`);
            dispatch({
                type: FETCH_DENTIST_SUCCESS,
                payload: response.data
            })
        } catch (error) {
            dispatch({
                type: FETCH_DENTIST_FAILED,
                error: error
            })
        }
    }
}


export const dentistLogin = (data) =>{
    return async dispatch=>{
        try {
            const response = await axios.post(`${DENTIST_URL}/login`,data);
            dispatch({
                type: LOGIN_DENTIST_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            ToastFunction("error", error.response.data.message);
        }
    }
}

export const fetchActiveDentist = (token) =>{
    return async dispatch =>{
        try {
            dispatch({type:ACTIVE_DENTIST_REQUEST});
            const response = await axios.get(`${DENTIST_URL}/loginedDentist/${token}`);
            dispatch({
                type:ACTIVE_DENTIST_SUCCESS,
                payload:response.data
            })
            await AsyncStorage.setItem("dentistId", response.data.dentistId);
        } catch (error) {
            console.log("Dentist");
        }
    } 
}

export const updateDentistInfo = (id, data, toastHandler,navigation)=>{
    return async dispatch=>{
        try {
            const response = await axios.put(`${DENTIST_URL}/update/dentist/login/${id}`,data);
            dispatch({
                type: UPDATE_DENTIST_INFO_SUCCESS,
                payload: response.data,
            })
            toastHandler("success", "Update information successfully")
            navigation.navigate("Dashboard");
        } catch (error) {
            toastHandler("error", error.response.data.message)
        }
    }
}

export const logoutDentist = () => {
    return async (dispatch) => {
      dispatch({
        type: LOGOUT_DENTIST_SUCCESS
      });
    };
  };