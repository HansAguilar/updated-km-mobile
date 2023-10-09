import axios from 'axios';
import { CREATE_PAYMENT_FAILED, CREATE_PAYMENT_SUCCESS, FETCH_PATIENT_FAILED, FETCH_PAYMENT_REQUEST, FETCH_PAYMENT_SUCCESS, UPDATE_PAYMENT_SUCCESS } from '../ActionType';
import { PAYMENT_URL, SOCKET_LINK } from '../../config/APIRoutes';
import * as io from "socket.io-client";

const socket = io.connect(SOCKET_LINK);
export const fetchPayment = (id) =>{
    return async dispatch =>{
        try {
            dispatch({type: FETCH_PAYMENT_REQUEST})
            const response = await axios.get(`${PAYMENT_URL}/all/${id}`);
            dispatch({type:FETCH_PAYMENT_SUCCESS, payload:response.data});
        } catch (error) {
            dispatch({type:FETCH_PATIENT_FAILED, error:error.response && error.response.data.message});
        }
    }
}

export const createPayment = (id, data) =>{
    return async dispatch => {
        try{
            const response = await axios.post(`${PAYMENT_URL}/paybill/${id}`,data)
            dispatch({type:CREATE_PAYMENT_SUCCESS, payload: response.data});
            socket.emit("payment_client_changes",{value:response.data})
        }catch(error){
            dispatch({type:CREATE_PAYMENT_FAILED, error:error.response && error.response.data.message});
        }
    }
}

export const fetchAdminPayment = (id) =>{
    return async dispatch =>{
        try {
            const response = await axios.get(`${PAYMENT_URL}/all/${id}`);
            dispatch({type:FETCH_PAYMENT_SUCCESS, payload:response.data});
        } catch (error) {
        }
    }
}

export const adminUpdatePayment = (data) =>{
    return async dispatch =>{
        try {
            dispatch({type:UPDATE_PAYMENT_SUCCESS, payload:data});
        } catch (error) {
        }
    }
}

// export const submitPaymentProof = (id) =>{
//     return async dispatch =>{
//         try {
//             const response = await axios.get(`${PAYMENT_URL}/`);
//             dispatch({type:FETCH_PAYMENT_SUCCESS, payload:response.data.filter((val)=>{ return val.appointment.patient.patientId === id })});
//         } catch (error) {
//         }
//     }
// }