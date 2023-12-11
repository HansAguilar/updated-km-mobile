import axios from "axios";
import { CREATE_PRESCRIPTION_SUCCESS, FETCH_FEE_FAILED, FETCH_FEE_REQUEST, FETCH_FEE_SUCCESS, FETCH_PRESCRIPTION_REQUEST, FETCH_PRESCRIPTION_SUCCESS } from "../ActionType"
import { PRESCRIPTION_LINK } from "../../config/APIRoutes";


export const fetchPrescription = (id) =>{
    return async dispatch=>{
        try {
            const response = await axios.get(`${PRESCRIPTION_LINK}/${id}`);
            dispatch({
                type: FETCH_PRESCRIPTION_SUCCESS,
                payload:response.data
            });
        } catch (error) {
            
        }
    }
}

export const createPrescription = (data) =>{
    return async dispatch=>{
        try {
            const response = await axios.post(`${PRESCRIPTION_LINK}/`,data);
            dispatch({
                type: CREATE_PRESCRIPTION_SUCCESS,
                payload:response.data
            });
        } catch (error) {
            
        }
    }
}