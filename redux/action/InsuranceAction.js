import axios from "axios";
import { CREATE_INSURANCE_SUCCESS, DELETE_INSURANCE_SUCCESS, FETCH_ALL_INSURANCE_FAILED, FETCH_ALL_INSURANCE_REQUEST, FETCH_ALL_INSURANCE_SUCCESS, FETCH_INSURANCE_FAILED, FETCH_INSURANCE_REQUEST, FETCH_INSURANCE_SUCCESS, UPDATE_INSURANCE_SUCCESS } from "../ActionType";
import { HMO_LINK } from "../../config/APIRoutes";

export const fetchAllInsurance = () =>{
    return async dispatch=>{
        try {
            const response = await axios.get(`${HMO_LINK}/`);
            dispatch({
                type: FETCH_ALL_INSURANCE_SUCCESS,
                payload:response.data
            })
        } catch (error) {
            dispatch({type: FETCH_ALL_INSURANCE_FAILED, error:error});
        }
    }
}

export const fetchInsurance = (patientId) =>{
    return async dispatch=>{
        try {
            const response = await axios.get(`${HMO_LINK}/patient/${patientId}`);
            dispatch({
                type: FETCH_INSURANCE_SUCCESS,
                payload:response.data
            })
        } catch (error) {
            dispatch({type: FETCH_INSURANCE_FAILED, error:error});
        }
    }
}

export const createInsurance = (patientId, data)=>{
    return async dispatch =>{
        try {
            const response = await axios.post(`${HMO_LINK}/addHmo/${patientId}`,data);
            dispatch({
                type: CREATE_INSURANCE_SUCCESS,
                payload: response.data
            })
        } catch (error) { }
    }
}

export const updateInsurance = (insuranceId, data)=>{
    return async dispatch =>{
        try {
            const response = await axios.put(`${HMO_LINK}/updateHmo/${insuranceId}`,data);
            dispatch({
                type: UPDATE_INSURANCE_SUCCESS,
                payload: response.data
            })
        } catch (error) { }
    }
}

export const deleteInsurance = (insuranceId)=>{
    return async dispatch =>{
        try {
            await axios.delete(`${HMO_LINK}/deleteHmo/${insuranceId}`);
            dispatch({
                type: DELETE_INSURANCE_SUCCESS,
                payload: insuranceId
            })
        } catch (error) { }
    }
}