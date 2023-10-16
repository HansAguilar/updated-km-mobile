import axios from "axios"
import { LOGIN_URL } from "../../config/APIRoutes"
import { LOGIN_ACCOUNT_FAILED, LOGIN_ACCOUNT_SUCCESS, LOGOUT_ACCOUNT_SUCCESS } from "../ActionType";

export const loginAdmin = (data)=>{
    return async dispatch =>{
        try {
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