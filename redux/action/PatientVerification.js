import axios from "axios";
import { 
    LOGIN_PATIENT_FAILED, 
    LOGIN_PATIENT_REQUEST,
    LOGIN_PATIENT_SUCCESS,
    LOGOUT_PATIENT_REQUEST,
    LOGOUT_PATIENT_SUCCESS,
    VALID_PATIENT_FAILED,
    VALID_PATIENT_REQUEST,
    VALID_PATIENT_SUCCESS
} from "../ActionType";
import { PATIENT_URL } from '../../config/APIRoutes';
import ToastFunction from "../../config/toastConfig";

export const loginPatientAccount = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${PATIENT_URL}/login`, data);
      dispatch({
        type: LOGIN_PATIENT_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: LOGIN_PATIENT_FAILED,
        error: error.response && error.response.data.message
      });
      ToastFunction("error",error.response.data.message)
    }
  };
};


export const checkIfValidPatient = (token) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${PATIENT_URL}/ifValidPatient/${token}`);
      dispatch({
        type: VALID_PATIENT_SUCCESS,
        payload: response.data.message
      });
    } catch (error) {
      dispatch({
        type: VALID_PATIENT_FAILED,
        error: error.response
      });
    }
  };
};

export const logoutPatient = () => {
  return async (dispatch) => {
    dispatch({
      type: LOGOUT_PATIENT_SUCCESS
    });
  };
};