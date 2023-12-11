import axios from "axios"
import { APPROVED_APPOINTMENT_SUCCESS, APPROVED_DENTIST_APPOINTMENT_FAILED, APPROVED_DENTIST_APPOINTMENT_SUCCESS, CREATE_APPOINTMENT_FAILED, CREATE_APPOINTMENT_REQUEST, CREATE_APPOINTMENT_SUCCESS, DELETE_APPOINTMENT_FAILED, DELETE_APPOINTMENT_SUCCESS, FETCH_APPOINTMENT_FAILED, FETCH_APPOINTMENT_REQUEST, FETCH_APPOINTMENT_SUCCESS, FETCH_DENTIST_APPOINTMENT_FAILED, FETCH_DENTIST_APPOINTMENT_SUCCESS, RESPONSE_APPOINTMENT_SUCCESS, UPDATE_APPOINTMENT_SUCCESS } from "../ActionType"
import { APPOINTMENT_URL, SOCKET_LINK } from "../../config/APIRoutes"
import { fetchAdminPayment,fetchPaymentAppointment,adminDeletePayment } from "../action/PaymentAction";
import moment from "moment";
import * as io from "socket.io-client";

const socket = io.connect(SOCKET_LINK);

export const fetchAppointment = (id) =>{
    return async (dispatch)=>{
        try {
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

export const fetchAllDentistAppointment = (dentistId)=>{
    return async (dispatch)=>{
        try {
            const response = await axios.get(`${APPOINTMENT_URL}/fetchAllDentistAppointment/${dentistId}`);
            dispatch({
                type:FETCH_DENTIST_APPOINTMENT_SUCCESS,
                payload: response.data.sort((a, b) => moment(a.appointmentDate).isAfter(b.appointmentDate) ? 1 : -1)
            });
        } catch (error) {
            dispatch({
                type: FETCH_DENTIST_APPOINTMENT_FAILED,
                error: error.response && error.response.data.message
            })
        }
    }
}

export const createAppointment = (data,navigation,ToastFunction,setModal) => {
    return async dispatch =>{
        try {
            const response = await axios.post(`${APPOINTMENT_URL}/`,data);
            const appointmentData = response.data;
            dispatch({
                type: CREATE_APPOINTMENT_SUCCESS,
                payload: appointmentData
            });
            const { appointmentId } = appointmentData;
            dispatch(fetchPaymentAppointment(appointmentId));
            const sendData = {value:appointmentId};
            socket.emit("new_appointment_patient_changes",JSON.stringify(sendData))
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
            await axios.delete(`${APPOINTMENT_URL}/${id}`);
            dispatch({
                type: DELETE_APPOINTMENT_SUCCESS,
                id:id
            });
            dispatch(adminDeletePayment(id));
            const sendData = {value: `${id}`}
            socket.emit("cancel_appointment", JSON.stringify(sendData));
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

export const adminChanges = (id)=>{
    return async dispatch=>{
        try {
            const response = await axios.get(`${APPOINTMENT_URL}/fetch/new_appointment/${id}`);
            dispatch({
                type: UPDATE_APPOINTMENT_SUCCESS,
                payload:response.data
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
            socket.emit("appointment_changes",{value:id});
        } catch (error) {
            
        }
    }
}

export const createDentistTreatment = (data) =>{
    return async dispatch=>{
        try {
            const response = await axios.post(`${APPOINTMENT_URL}/treatment`,data);
            dispatch({
                type: APPROVED_DENTIST_APPOINTMENT_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            
        }
    }
}

export const approvedDentistAppointment = (id) =>{
    return async dispatch=>{
        try {
            const response = await axios.put(`${APPOINTMENT_URL}/status/done/${id}`);
            dispatch({
                type: APPROVED_DENTIST_APPOINTMENT_SUCCESS,
                payload: response.data
            });
            socket.emit("appointment_changes",{value:id});
        } catch (error) {
            
        }
    }
}

export const updateAppointment = (id,data) =>{
    return async dispatch=>{
        try {
            const response = await axios.put(`${APPOINTMENT_URL}/update/${id}`,data);
            const appointmentData = response.data;
            dispatch({
                type: UPDATE_APPOINTMENT_SUCCESS,
                payload: response.data
            });

            const sendData = {value: appointmentData.appointmentId }
            socket.emit("appointment_changes",JSON.stringify(sendData));
        } catch (error) {
            
        }
    }
}

export const createAppointmentByAdmin= (id) => {
    return async dispatch =>{
        try {
            const response = await axios.get(`${APPOINTMENT_URL}/fetch/new_appointment/${id}`);
            dispatch({
                type: CREATE_APPOINTMENT_SUCCESS,
                payload: response.data
            });
            const { appointmentId } = response.data;
            dispatch(fetchPaymentAppointment(appointmentId));
        } catch (error) { }
    }
}

export const deleteByAdmin= (id) => {
    return async dispatch =>{
        try {
            dispatch({
                type: DELETE_APPOINTMENT_SUCCESS,
                id: id
            });
        } catch (error) { }
    }
}