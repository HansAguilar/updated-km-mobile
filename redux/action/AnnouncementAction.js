import axios from 'axios';
import { FETCH_ANNOUNCEMENT_REQUEST, FETCH_ANNOUNCEMENT_SUCCESS, FETCH_ANNOUNCEMENT_FAILED } from '../ActionType';
import { ANNOUNCEMENT_URL } from '../../config/APIRoutes';

export const fetchAnnouncement = () =>{
    return async (dispatch)=>{
        try {
            const response = await axios.get(`${ANNOUNCEMENT_URL}/`);
            dispatch({
                type: FETCH_ANNOUNCEMENT_SUCCESS,
                payload: response.data
            })
        } catch (error) {
            dispatch({
                type: FETCH_ANNOUNCEMENT_FAILED,
                error:error
            });
        }
    }
}