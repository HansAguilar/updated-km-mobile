import axios from 'axios';
import { FETCH_SERVICES_FAILED, FETCH_SERVICES_REQUEST, FETCH_SERVICES_SUCCESS } from '../ActionType';
import { SERVICES_URL } from '../../config/APIRoutes';
export const fetchServices = () =>{
    return async(dispatch)=>{
        try {
            const response = await axios(`${SERVICES_URL}/`);
            dispatch({
                type: FETCH_SERVICES_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            dispatch({
                type: FETCH_SERVICES_FAILED,
                error: error
            })
        }
    }
}