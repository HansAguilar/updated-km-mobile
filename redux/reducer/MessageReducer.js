import { ADMIN_SEND_MESSAGE_SUCCESS, CREATE_MESSAGE_SUCCESS, CREATE_NEW_MESSAGE_SUCCESS, FETCH_MESSAGE_FAILED, FETCH_MESSAGE_REQUEST, FETCH_MESSAGE_SUCCESS, RESPONSE_MESSAGE_SUCCESS, SEND_MESSAGE_SUCCESS } from '../ActionType';

const reducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_MESSAGE_REQUEST:
            return { ...state, loading: true };

        case FETCH_MESSAGE_SUCCESS:
            return { ...state, message:action.payload, loading: false };
            
        case SEND_MESSAGE_SUCCESS:
            return{ 
                ...state, 
                message:state.message.map((val)=>{
                    if(val.roomId===action.key){
                        return {
                            ...val,
                            messageEntityList:[...val.messageEntityList, action.payload]
                        }
                    }
                    return val;
                }) ,
                loading:false}
        
        case ADMIN_SEND_MESSAGE_SUCCESS:
            return{ 
                ...state, 
                message:state.message.map((val)=>{
                    if(val.roomId===action.key){
                        return {
                            ...val,
                            messageEntityList:[...val.messageEntityList, action.payload]
                        }
                    }
                    return val;
                }) ,
                loading:false}

        case RESPONSE_MESSAGE_SUCCESS:
            return {
                ...state,
                message:{ ...state.message, [action.key]: state.message[action.key]?[...state.message[action.key],action.payload] :[action.payload] },
                loading:false,
              };
        
        case CREATE_MESSAGE_SUCCESS:
            return{ 
                ...state, 
                message: state.message.length > 0? [...state.message, action.payload]:[action.payload],
                loading:false
            }
        case CREATE_NEW_MESSAGE_SUCCESS:
                return{ 
                    ...state, 
                    message:  [...state.message, action.payload],
                    loading:false
            }
        case FETCH_MESSAGE_FAILED:
            return { ...state, error: action.error, loading: false };
        default: return state;
    }
}

export default reducer;