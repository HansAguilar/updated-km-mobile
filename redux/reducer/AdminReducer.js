import { FETCH_ADMIN_FAILED, FETCH_ADMIN_REQUEST, FETCH_ADMIN_SUCCESS, FETCH_ANNOUNCEMENT_FAILED, FETCH_ANNOUNCEMENT_REQUEST, FETCH_ANNOUNCEMENT_SUCCESS } from "../ActionType";

const reducer = (state={}, action)=>{
    switch (action.type) {
        case FETCH_ADMIN_REQUEST:
            return { ...state, loading:true}
        case FETCH_ADMIN_SUCCESS:
            return {...state, admin: action.payload, loading:false}
        case FETCH_ADMIN_FAILED:
            return {...state, error:action.error, loading:false}
        default: return state;
    }
}

export default reducer;