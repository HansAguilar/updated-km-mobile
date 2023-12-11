import axios from "axios";
import { FETCH_FEE_FAILED, FETCH_FEE_REQUEST, FETCH_FEE_SUCCESS, UPDATE_FEE_SUCCESS } from "../ActionType"
import { FEE_LINK } from "../../config/APIRoutes";


export const fetchAppointmentFee = () =>{
    return async dispatch=>{
        try {
            const response = await axios.get(`${FEE_LINK}/`);
            dispatch({
                type: FETCH_FEE_SUCCESS,
                payload:response.data
            })
        } catch (error) {
            dispatch({type: FETCH_FEE_FAILED, error:error.response.data.message});
        }
    }
}

export const updateAppointmentFee = (value) =>{
    return async dispatch=>{
        try {
            dispatch({
                type: UPDATE_FEE_SUCCESS,
                payload:value
            })
        } catch (error) { }
    }
}