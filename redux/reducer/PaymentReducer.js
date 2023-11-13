import { CANCELLED_PAYMENT_SUCCESS, CREATE_PAYMENT_FAILED, CREATE_PAYMENT_SUCCESS, DELETE_PAYMENT_SUCCESS, FETCH_NEW_PAYMENT_SUCCESS, FETCH_PAYMENT_FAILED, FETCH_PAYMENT_REQUEST, FETCH_PAYMENT_SUCCESS, UPDATE_PAYMENT_SUCCESS } from "../ActionType"

const initialState = {
    loading:false,
    payment:[],
    error:null
}

const reducer = (state={}, action)=>{
    switch(action.type){
        case FETCH_PAYMENT_REQUEST:
            return {...state, loading:true};
        case FETCH_PAYMENT_SUCCESS:
            return {...state, payment:action.payload, loading:false};
        case FETCH_NEW_PAYMENT_SUCCESS:
            return {...state, payment:[...state.payment, action.payload], loading:false};
        case UPDATE_PAYMENT_SUCCESS: 
            return{
                ...state, 
                payment: state.payment.map((val)=>val.paymentId === action.payload.paymentId ? action.payload: val),
                loading:false
            }
        case CREATE_PAYMENT_SUCCESS :
            return {
                ...state, 
                payment:state.payment.map(val=>{ return val.paymentId === action.payload.paymentId ? action.payload : val}),
                loading:false,
            }
        case CANCELLED_PAYMENT_SUCCESS :
            return{
                ...state, 
                payment: state.payment.map((val)=>{return val.paymentId === action.payload.paymentId ? action.payload: val}),
                loading:false
            }
        case DELETE_PAYMENT_SUCCESS:
            return { ...state, payment:state.payment.filter((val)=>val.appointment.appointmentId!=action.payload), loading:false }
        case FETCH_PAYMENT_FAILED,CREATE_PAYMENT_FAILED:
            return {...state, error:action.error, loading:false};
        default:
            return state;
    }
}

export default reducer;