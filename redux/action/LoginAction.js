import axios from "axios"
import { LOGIN_URL } from "../../config/APIRoutes"
import { CHANGE_PASSWORD_FAILED, CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, LOGIN_ACCOUNT_FAILED, LOGIN_ACCOUNT_REQUEST, LOGIN_ACCOUNT_SUCCESS, LOGOUT_ACCOUNT_SUCCESS, SEND_OTP_FAILED, SEND_OTP_REQUEST, SEND_OTP_SUCCESS } from "../ActionType";

export const loginAdmin = (data)=>{
    return async dispatch =>{
        try {
            dispatch({ type: LOGIN_ACCOUNT_REQUEST, })
            const response = await axios.post(`${LOGIN_URL}/`,data);
            dispatch({
                type: LOGIN_ACCOUNT_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            dispatch({
                type: LOGIN_ACCOUNT_FAILED,
                error: error && error.response.data.message,
            })
        }
    }
} 

export const forgotPassword = (data)=>{
    return async dispatch =>{
        try {
            dispatch({ type: SEND_OTP_REQUEST })
            const response = await axios.post(`${LOGIN_URL}/findAccountEmail/`,data);
            dispatch({
                type: SEND_OTP_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            dispatch({
                type: SEND_OTP_FAILED,
                error: error && error.response.data.message,
            })
        }
    }
} 

export const changePassword = (email,data)=>{
    return async dispatch =>{
        try {
            dispatch({ type: CHANGE_PASSWORD_REQUEST })
            const response = await axios.post(`${LOGIN_URL}/changePassword/${email}`,data);
            dispatch({
                type: CHANGE_PASSWORD_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            dispatch({
                type: CHANGE_PASSWORD_FAILED,
                error: error && error.response.data.message,
            })
        }
    }
} 

export const logOutAccount = ()=>{
    return async dispatch =>{
        try {
            dispatch({
                type: LOGOUT_ACCOUNT_SUCCESS,
            })
        } catch (error) {
        }
    }
} 