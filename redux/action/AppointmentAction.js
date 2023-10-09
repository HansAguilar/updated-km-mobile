import axios from "axios"
import { APPROVED_APPOINTMENT_SUCCESS, CREATE_APPOINTMENT_FAILED, CREATE_APPOINTMENT_REQUEST, CREATE_APPOINTMENT_SUCCESS, DELETE_APPOINTMENT_FAILED, DELETE_APPOINTMENT_SUCCESS, FETCH_APPOINTMENT_FAILED, FETCH_APPOINTMENT_REQUEST, FETCH_APPOINTMENT_SUCCESS, RESPONSE_APPOINTMENT_SUCCESS, UPDATE_APPOINTMENT_SUCCESS } from "../ActionType"
import { APPOINTMENT_URL, SOCKET_LINK } from "../../config/APIRoutes"
import { fetchAdminPayment } from "../action/PaymentAction";
import moment from "moment";
import * as io from "socket.io-client";

const socket = io.connect(SOCKET_LINK);
export const fetchAppointment = (id) =>{
    return async (dispatch)=>{
        try {
            dispatch({
                type: FETCH_APPOINTMENT_REQUEST,
            })
            const response = await axios.get(`${APPOINTMENT_URL}/`);
            dispatch({
                type:FETCH_APPOINTMENT_SUCCESS,
                payload: response.data.sort((a, b) => moment(a.appointmentDate).isAfter(b.appointmentDate) ? 1 : -1)
            });
        } catch (error) {
            dispatch({
                type: FETCH_APPOINTMENT_FAILED,
                error: error.response && error.response.data.message
            })
        }
    }
}

export const createAppointment = (data,navigation,ToastFunction,setModal) => {
    return async dispatch =>{
        try {
            const response = await axios.post(`${APPOINTMENT_URL}/`,data);
            dispatch({
                type: CREATE_APPOINTMENT_SUCCESS,
                payload: response.data
            });
            dispatch(fetchAdminPayment(response.data.patient.patientId))
            socket.emit("appointment_changes",{value:response.data})
            navigation.navigate("Dashboard");
        } catch (error) {
            ToastFunction("error", error.response.data.message);
            setModal(false);
        }
    }
}


export const cancelAppointment = (id) =>{
    return async (dispatch)=>{
        try {
            const response = await axios.delete(`${APPOINTMENT_URL}/${id}`);
            dispatch({
                type: DELETE_APPOINTMENT_SUCCESS,
                id:id
            });
            socket.emit("cancel_appointment", {value:id})
        } catch (error) {
            dispatch({
                type:DELETE_APPOINTMENT_FAILED,
                error: error && error.response.data.message
            })
        }
    }
}

export const fetchChanges = (data)=>{
    return async dispatch=>{
        try {
            dispatch({
                type: RESPONSE_APPOINTMENT_SUCCESS,
                payload:data
            })
        } catch (error) {
            
        }
    }
}

export const adminChanges = (data)=>{
    return async dispatch=>{
        try {
            dispatch({
                type: CREATE_APPOINTMENT_SUCCESS,
                payload:data
            })
        } catch (error) {
            
        }
    }
}

export const createTreatment = (data) =>{
    return async dispatch=>{
        try {
            const response = await axios.post(`${APPOINTMENT_URL}/treatment`,data);
            dispatch({
                type: UPDATE_APPOINTMENT_SUCCESS,
                payload: response.data
            });
            socket.emit("appointment_changes",{value:response.data})
        } catch (error) {
            
        }
    }
}

export const approvedAppointment = (id) =>{
    return async dispatch=>{
        try {
            const response = await axios.put(`${APPOINTMENT_URL}/status/done/${id}`);
            dispatch({
                type: APPROVED_APPOINTMENT_SUCCESS,
                payload: response.data
            });
            socket.emit("appointment_changes",{value:response.data});
        } catch (error) {
            
        }
    }
}