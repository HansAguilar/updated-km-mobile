import axios from "axios";
import { FETCH_ADMIN_FAILED, FETCH_ADMIN_REQUEST, FETCH_ADMIN_SUCCESS, } from "../ActionType"
import { ADMIN_LINK, } from "../../config/APIRoutes";


export const fetchAdmin= () =>{
    return async dispatch=>{
        try {
            const response = await axios.get(`${ADMIN_LINK}/`);
            const filteredData = response?.data?.filter((val)=>val.role === "STAFF")
            dispatch({
                type: FETCH_ADMIN_SUCCESS,
                payload:filteredData
            })
        } catch (error) {
            dispatch({type: FETCH_ADMIN_FAILED, error:error.response.data.message});
        }
    }
}
