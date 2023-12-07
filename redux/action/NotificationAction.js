import axios from "axios";
import { ADMIN_SEND_MESSAGE_SUCCESS, CREATE_MESSAGE_SUCCESS, CREATE_NOTIFICATION_SUCCESS, DELETE_ALL_NOTIFICATION_SUCCESS, FETCH_MESSAGE_FAILED, FETCH_MESSAGE_REQUEST, FETCH_MESSAGE_SUCCESS, FETCH_NOTIFICATION_FAILED, FETCH_NOTIFICATION_REQUEST, FETCH_NOTIFICATION_SUCCESS, RESPONSE_MESSAGE_SUCCESS, SEND_MESSAGE_SUCCESS, UPDATE_NOTIFICATION_SUCCESS } from "../ActionType"
import { MESSAGE_URL, NOTIFICATION_LINK, SOCKET_LINK } from "../../config/APIRoutes";
import * as io from "socket.io-client";
import { useSelector } from "react-redux";

const socket = io.connect(SOCKET_LINK);
export const fetchAllNotification = (patientId) =>{
    return async dispatch => {
        try {
            const response = await axios.get(`${NOTIFICATION_LINK}/patient/${patientId}`);
            dispatch({
                type: FETCH_NOTIFICATION_SUCCESS,
                payload: response.data
            })
        } catch (error) {
            dispatch({
                type:FETCH_NOTIFICATION_FAILED,
                error
            })
        }
    }
}
export const fetchNotificationQuickly = (patientId) =>{
    return async dispatch => {
        try {
            const response = await axios.get(`${NOTIFICATION_LINK}/patient/${patientId}`);
            dispatch({
                type: FETCH_NOTIFICATION_SUCCESS,
                payload: response.data
            })
        } catch (error) {
            dispatch({
                type:FETCH_NOTIFICATION_FAILED,
                error
            })
        }
    }
}

export const createNotification = (data) =>{
    return async dispatch =>{
        try {
            const response = await axios.post(`${NOTIFICATION_LINK}/`,data);
            const { notificationId } = response.data;
            const sendData = { value: `${notificationId}`};
            socket.emit("send_notification", JSON.stringify(sendData))
        } catch (error) {
            
        }
    } 
}

export const storeNotification = (notificationId) =>{
    return async dispatch =>{
        try {
            const response = await axios.get(`${NOTIFICATION_LINK}/fetch_notification/${notificationId}`);
            dispatch({
                type: CREATE_NOTIFICATION_SUCCESS,
                payload: response.data
            })
        } catch (error) {
            
        }
    } 
}

export const readPatientNotification = (notificationId,setData) =>{
    return async dispatch =>{
        try {
            const response = await axios.put(`${NOTIFICATION_LINK}/read_notification/${notificationId}`);
            const appointmentData = response.data;
            dispatch({
                type: UPDATE_NOTIFICATION_SUCCESS,
                payload: appointmentData
            })
            setData(appointmentData);
        } catch (error) {
            
        }
    } 
}

export const deleteAllNotification = (patientId) =>{
    return async dispatch => {
        try {
            await axios.delete(`${NOTIFICATION_LINK}/deleteAll/notification/${patientId}`);
            dispatch({
                type:DELETE_ALL_NOTIFICATION_SUCCESS,
                payload:[]
            })
        } catch (error) {
            
        }
    }
}
