// Action Types
import axios from 'axios';
import { PATIENT_URL } from '../../config/APIRoutes';
import { FETCH_PATIENT_REQUEST, FETCH_PATIENT_SUCCESS, FETCH_PATIENT_FAILED,ALL_PATIENT_FAILED, ALL_PATIENT_REQUEST, ALL_PATIENT_SUCCESS, UPDATE_PATIENT_INFO_SUCCESS, LOGOUT_PATIENT_SUCCESS } from '../ActionType';
import AsyncStorage from "@react-native-async-storage/async-storage"

export const fetchAllPatient = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${PATIENT_URL}/fetch`);
      dispatch({
        type: ALL_PATIENT_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: ALL_PATIENT_FAILED,
        error: error.response.data.message, // or any other error handling logic you want
      });
    }
  };
};

// Action Creator
export const fetchPatient = (token) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${PATIENT_URL}/fetchPatient/${token}`);
      dispatch({
        type: FETCH_PATIENT_SUCCESS,
        payload: response.data,
      });
      await AsyncStorage.setItem("patientId", response.data.patientId)
    } catch (error) {
      dispatch({
        type: FETCH_PATIENT_FAILED,
        error: error.response.data.message, // or any other error handling logic you want
      });
    }
  };
};

// Action Creator
export const updatePatientInfo = (id, data,ToastFunction, navigation) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${PATIENT_URL}/update/patient/login/${id}`, data);
      dispatch({
        type: UPDATE_PATIENT_INFO_SUCCESS,
        payload: response.data,
      });
      ToastFunction("success", "Update patient information successfully");
      navigation.navigate("Dashboard");
    } catch (error) {
      ToastFunction("error", error.response.data.message);
    }
  };
};

export const logoutPatientAccount = () =>{
  return async dispatch =>{
      try {
          dispatch({
            type: LOGOUT_PATIENT_SUCCESS,})
      } catch (error) { }
  }
}

