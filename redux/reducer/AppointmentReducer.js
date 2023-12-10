import { APPROVED_APPOINTMENT_SUCCESS, APPROVED_DENTIST_APPOINTMENT_SUCCESS, CREATE_APPOINTMENT_FAILED, CREATE_APPOINTMENT_REQUEST, CREATE_APPOINTMENT_SUCCESS, DELETE_APPOINTMENT_FAILED, DELETE_APPOINTMENT_SUCCESS, FETCH_APPOINTMENT_FAILED, FETCH_APPOINTMENT_REQUEST, FETCH_APPOINTMENT_SUCCESS, FETCH_DENTIST_APPOINTMENT_SUCCESS, RESPONSE_APPOINTMENT_SUCCESS, UPDATE_APPOINTMENT_SUCCESS } from "../ActionType";

const initialState = {
    loading: false,
    appointment: [],
    error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_APPOINTMENT_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_APPOINTMENT_SUCCESS:
            return {
                ...state,
                appointment: action.payload,
                loading: false
            };
        case FETCH_DENTIST_APPOINTMENT_SUCCESS:
            return {
                ...state,
                dentistAppointment: action.payload,
                loading: false
            };
        case CREATE_APPOINTMENT_SUCCESS:
            return {
                ...state,
                appointment: [...state.appointment, action.payload],
                loading: false
            };
        case UPDATE_APPOINTMENT_SUCCESS: 
            return{
                ...state, 
                appointment: state.appointment.map((val)=>val.appointmentId === action.payload.appointmentId ? action.payload: val)
            }
        case APPROVED_APPOINTMENT_SUCCESS:
                return{
                    ...state,
                    appointment: state.appointment.map((val)=>val.appointmentId === action.payload.appointmentId ? action.payload: val),
                    loading:false,
                }
        case APPROVED_DENTIST_APPOINTMENT_SUCCESS:
            return{
                ...state,
                    dentistAppointment: state.dentistAppointment.map((val)=>val.appointmentId === action.payload.appointmentId ? action.payload: val),
                    loading:false,
            }
        case DELETE_APPOINTMENT_SUCCESS:
            return{
                ...state,
                appointment: state.appointment.filter(val=>val.appointmentId !== action.id),
                loading:false,
            }
        case RESPONSE_APPOINTMENT_SUCCESS:
            return{
                ...state,
                appointment:state.appointment.map(val=>{return val.appointmentId===action.payload.appointmentId?action.payload:val}),
                loading:false
            }
        case FETCH_APPOINTMENT_FAILED, CREATE_APPOINTMENT_FAILED,DELETE_APPOINTMENT_FAILED:
            return {
                ...state,
                error: action.error,
                loading: false
            };
        default:
            return state;
    }
};

export default reducer;
