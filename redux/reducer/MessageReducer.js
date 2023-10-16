import { CREATE_MESSAGE_SUCCESS, FETCH_MESSAGE_FAILED, FETCH_MESSAGE_REQUEST, FETCH_MESSAGE_SUCCESS, RESPONSE_MESSAGE_SUCCESS } from '../ActionType';

const reducer = (state={}, action) =>{
    switch(action.type){
        case FETCH_MESSAGE_REQUEST:
            return { ...state, loading: true };
        case FETCH_MESSAGE_SUCCESS:
            return { ...state, message:action.payload, loading: false };
        case CREATE_MESSAGE_SUCCESS:
            return{ 
                ...state, 
                message:{ ...state.message, [action.key]: state.message[action.key]?[...state.message[action.key],action.payload] :[action.payload] }, 
                loading:false}
        case RESPONSE_MESSAGE_SUCCESS:
            return {
                ...state,
                message:{ ...state.message, [action.key]: state.message[action.key]?[...state.message[action.key],action.payload] :[action.payload] },
                loading:false,
              };
            // return{ ...state, message:{ ...state.message, [action.key]: state.message[action.key]?[...state.message[action.key],action.payload] :[action.payload] }, loading:false}
        case FETCH_MESSAGE_FAILED:
            return { ...state, error: action.error, loading: false };
        default: return state;
    }
}

export default reducer;