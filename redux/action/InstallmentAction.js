import axios from "axios";
import { FETCH_INSTALLMENT_FAILED, FETCH_INSTALLMENT_REQUEST, FETCH_INSTALLMENT_SUCCESS } from "../ActionType"
import { INSTALLMENT_URL } from "../../config/APIRoutes";

export const fetchInstallmentByPatient = (id) =>{
    return async dispatch => {
        try {
            const response = await axios.get(`${INSTALLMENT_URL}/findById/${id}`);
            dispatch({type: FETCH_INSTALLMENT_SUCCESS, payload:response.data});
        } catch (error) {
            dispatch({type: FETCH_INSTALLMENT_FAILED, error: error})
        }
    }
}