import axios from 'axios';
import { FETCH_SCHEDULE_FAILED, FETCH_SCHEDULE_REQUEST, FETCH_SCHEDULE_SUCCESS } from '../ActionType';
import { DENTIST_URL, SCHEDULE_LINK } from '../../config/APIRoutes';
import ToastFunction from '../../config/toastConfig';

export const fetchSchedule = () =>{
    return async(dispatch) =>{
        try {
            const response = await axios.get(`${SCHEDULE_LINK}/`);
            dispatch({
                type: FETCH_SCHEDULE_SUCCESS,
                payload: response.data
            })
        } catch (error) {
            dispatch({
                type: FETCH_SCHEDULE_FAILED,
                error: error
            })
        }
    }
}