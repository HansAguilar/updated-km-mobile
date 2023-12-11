import axios from "axios";
import { ADMIN_SEND_MESSAGE_SUCCESS, CREATE_MESSAGE_SUCCESS, CREATE_NEW_MESSAGE_SUCCESS, FETCH_MESSAGE_FAILED, FETCH_MESSAGE_REQUEST, FETCH_MESSAGE_SUCCESS, RESPONSE_MESSAGE_SUCCESS, SEND_MESSAGE_SUCCESS } from "../ActionType"
import { MESSAGE_URL, SOCKET_LINK } from "../../config/APIRoutes";
import * as io from "socket.io-client";
import { useSelector } from "react-redux";

const socket = io.connect(SOCKET_LINK);


export const fetchPatientMessage = (patientId) => {
    return async dispatch => {
        try {
            const response = await axios.get(`${MESSAGE_URL}/patient_login/${patientId}`);
            dispatch({
                type: FETCH_MESSAGE_SUCCESS,
                payload: response.data
            })
        } catch (error) {
            dispatch({
                type:FETCH_MESSAGE_FAILED,
                error
            })
        }
    }
}

export const fetchAdminMessage = (patientId) =>{
    return async dispatch => {
        try {
            const response = await axios.get(`${MESSAGE_URL}/patient_login/${patientId}`);
            dispatch({
                type: FETCH_MESSAGE_SUCCESS,
                payload: response.data
            })
        } catch (error) {
            dispatch({
                type: FETCH_MESSAGE_FAILED,
                error
            })
        }
    }
}

export const sendPatientMessage = (roomKey, data) =>{
    return async dispatch=>{
        try {
            const response = await axios.post(`${MESSAGE_URL}/send_message/`,data);
            dispatch({
                type:SEND_MESSAGE_SUCCESS,
                key:roomKey,
                payload:response.data
            })
           socket.emit("send_to_admin",{key:roomKey, value:data});
        } catch (error) {

        }
    }
}

export const fetchNewPatientMessage = (roomKey) =>{
    return async dispatch=>{
        try {
            const response = await axios.get(`${MESSAGE_URL}/fetch_room/${roomKey}`);
            dispatch({
                type:CREATE_MESSAGE_SUCCESS,
                payload:response.data
            })
        //    socket.emit("send_to_admin",{key:roomKey, value:response.data});
        } catch (error) {}
    }
}

export const sendByAdminMessage = (roomKey, data) =>{
    return async dispatch=>{
        try {
            dispatch({
                type:ADMIN_SEND_MESSAGE_SUCCESS,
                key:roomKey,
                payload:data
            })
        } catch (error) {
            
        }
    }
}

export const createNewMessage = (key, data) => {
    return async dispatch => {
      try {
        const response = await axios.post(`${MESSAGE_URL}/new_message/`, data);
        dispatch({
          type: CREATE_NEW_MESSAGE_SUCCESS,
          payload: response.data
        });
      const sendData = { key: key, admin:data.adminId}
      socket.emit("create_message_patient", JSON.stringify(sendData));
      } catch (error) {
        console.log("send_message", error);
      }
    };
  };

