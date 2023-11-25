import { CREATE_INSURANCE_SUCCESS, DELETE_INSURANCE_SUCCESS, FETCH_ALL_INSURANCE_FAILED, FETCH_ALL_INSURANCE_REQUEST, FETCH_ALL_INSURANCE_SUCCESS, FETCH_INSURANCE_FAILED, FETCH_INSURANCE_REQUEST, FETCH_INSURANCE_SUCCESS, UPDATE_INSURANCE_SUCCESS } from "../ActionType";

const reducer = (state={}, action)=>{
    switch(action.type){
        case FETCH_ALL_INSURANCE_REQUEST:
            return { ...state, loading:true};
        case FETCH_ALL_INSURANCE_SUCCESS:
            return { ...state, allInsurance:action.payload, loading:false};
        case FETCH_INSURANCE_REQUEST:
            return { ...state, loading:true};
        case FETCH_INSURANCE_SUCCESS:
            return { ...state, insurance:action.payload, loading:false};
        case CREATE_INSURANCE_SUCCESS:
            return { ...state, insurance:[...state.insurance, action.payload], loading:false}
        case UPDATE_INSURANCE_SUCCESS:
            return { ...state, insurance:state.insurance.map((val)=>val.insuranceId === action.payload.insuranceId? action.payload : val)}
        case DELETE_INSURANCE_SUCCESS:
            return { ...state, insurance:state.insurance.filter((val)=>val.insuranceId!==action.payload) , loading:false}
        case FETCH_INSURANCE_FAILED:
            return { ...state, error:action.error, loading:false};
        case FETCH_ALL_INSURANCE_FAILED:
            return { ...state, error:action.error, loading:false};
        default:
            return state;
    }
}

export default reducer;