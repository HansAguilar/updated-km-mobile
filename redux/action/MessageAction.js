import axios from "axios";
import { CREATE_MESSAGE_SUCCESS, FETCH_MESSAGE_FAILED, FETCH_MESSAGE_REQUEST, FETCH_MESSAGE_SUCCESS, RESPONSE_MESSAGE_SUCCESS } from "../ActionType"
import { MESSAGE_URL, SOCKET_LINK } from "../../config/APIRoutes";
import * as io from "socket.io-client";

const socket = io.connect(SOCKET_LINK);
export const fetchPatientMessage = (patientId) =>{
    return async dispatch => {
        try {
            dispatch({ type: FETCH_MESSAGE_REQUEST });
            const response = await axios.get(`${MESSAGE_URL}/`);
            const patientMessage = { };
            for(const [roomId, messageData] of Object.entries(response.data)){
                const filteredMessage = messageData.filter((patient)=>patient.receiverId.patientId === patientId)
                if(filteredMessage.length>0){
                    patientMessage[roomId] = filteredMessage;
                }
            }
            dispatch({
                type: FETCH_MESSAGE_SUCCESS,
                payload: patientMessage
            })
        } catch (error) {
            dispatch({
                type:FETCH_MESSAGE_FAILED,
                error
            })
        }
    }
}

export const createMessage = (roomKey, data) =>{
    return async dispatch=>{
        try {
            const response = await axios.post(`${MESSAGE_URL}/`,data);
            dispatch({
                type:CREATE_MESSAGE_SUCCESS,
                key:roomKey,
                payload:response.data
            })
           socket.emit("send_to_admin",{key:roomKey, value:response.data});
        } catch (error) {
            
        }
    }
}

export const fetchResponseMessage = (patientId) =>{
    return async dispatch =>{
        try {
            const response = await axios.get(`${MESSAGE_URL}/${patientId}`);
            const patientMessage = { };
            for(const [roomId, messageData] of Object.entries(response.data)){
                const filteredMessage = messageData.filter((patient)=>patient.receiverId.patientId === patientId)
                if(filteredMessage.length>0){
                    patientMessage[roomId] = filteredMessage;
                }
            }
            dispatch({
                type: FETCH_MESSAGE_SUCCESS,
                payload: patientMessage
            })
        } catch (error) {
            
        }
    }
}