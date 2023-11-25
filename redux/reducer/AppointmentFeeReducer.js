import { FETCH_FEE_REQUEST, FETCH_FEE_SUCCESS, FETCH_FEE_FAILED, UPDATE_FEE_SUCCESS } from '../ActionType';

const reducer = (state={}, action) =>{
    switch(action.type){
        case FETCH_FEE_REQUEST:
            return { ...state, loading: true };
        case FETCH_FEE_SUCCESS:
            return { ...state, paymentFee:action.payload, loading: false };
        case UPDATE_FEE_SUCCESS:
            return { ...state, paymentFee:{...state.paymentFee, status:action.payload}, loading: false };
        case FETCH_FEE_FAILED:
            return { ...state, error: action.error, loading: false };
        default: return state;
    }
}

export default reducer;