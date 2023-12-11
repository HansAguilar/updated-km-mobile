import axios from 'axios';
import { CANCELLED_PAYMENT_SUCCESS, CREATE_PAYMENT_FAILED, CREATE_PAYMENT_SUCCESS, DELETE_PAYMENT_SUCCESS, FETCH_NEW_PAYMENT_SUCCESS, FETCH_PATIENT_FAILED, FETCH_PAYMENT_REQUEST, FETCH_PAYMENT_SUCCESS, UPDATE_PAYMENT_SUCCESS } from '../ActionType';
import { PAYMENT_URL, SOCKET_LINK } from '../../config/APIRoutes';
import * as io from "socket.io-client";
import { createNotification } from './NotificationAction';

const socket = io.connect(SOCKET_LINK);

export const fetchPayment = (id) =>{
    return async dispatch =>{
        try {
            const response = await axios.get(`${PAYMENT_URL}/all/${id}`);
            const filteredAppointment = response.data.filter((val)=>val.status!=="CANCELLED"||val.status!=="FAILED");
            dispatch({type:FETCH_PAYMENT_SUCCESS, payload:filteredAppointment});
        } catch (error) {
            dispatch({type:FETCH_PATIENT_FAILED, error:error.response && error.response.data.message});
        }
    }
}
export const dentistFetchPayment = (id,setLoading) =>{
    return async dispatch =>{
        try {
            const response = await axios.get(`${PAYMENT_URL}/all/${id}`);
            const filteredAppointment = response.data.filter((val)=>val.status!=="CANCELLED"||val.status!=="FAILED");
            dispatch({type:FETCH_PAYMENT_SUCCESS, payload:filteredAppointment});
            setLoading(false);
        } catch (error) {
            dispatch({type:FETCH_PATIENT_FAILED, error:error.response && error.response.data.message});
        }
    }
}

export const createPayment = (id, data) =>{
    return async dispatch => {
        try{
            const response = await axios.post(`${PAYMENT_URL}/paybill/${id}`,data);
              dispatch({type:CREATE_PAYMENT_SUCCESS, payload: response.data});
        }catch(error){
            dispatch({type:CREATE_PAYMENT_FAILED, error:error.response && error.response.data.message});
        }
    }
}


export const fetchAdminPayment = (id) =>{
    return async dispatch =>{
        try {
            const response = await axios.get(`${PAYMENT_URL}/fetch/new_payment/${id}`);
            dispatch({type:UPDATE_PAYMENT_SUCCESS, payload:response.data});
        } catch (error) {
        }
    }
}

export const fetchPaymentAppointment = (id) =>{
    return async dispatch =>{
        try {
            const response = await axios.get(`${PAYMENT_URL}/${id}`);
            dispatch({type:FETCH_NEW_PAYMENT_SUCCESS, payload:response.data});
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

export const adminCancelledPayment = (id) =>{
    return async dispatch =>{
        try {
            const response = await axios.get(`${PAYMENT_URL}/fetch/cancelled_payment_details/${id}`);
            dispatch({type:CANCELLED_PAYMENT_SUCCESS, payload:response.data});
        } catch (error) {
        }
    }
}

export const adminDeletePayment = (id) =>{
    return async dispatch =>{
        try {
            dispatch({type:DELETE_PAYMENT_SUCCESS, payload:id});
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