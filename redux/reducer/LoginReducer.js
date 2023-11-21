import { CHANGE_PASSWORD_FAILED, CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, LOGIN_ACCOUNT_FAILED, LOGIN_ACCOUNT_REQUEST, LOGIN_ACCOUNT_SUCCESS, LOGOUT_ACCOUNT_SUCCESS, SEND_OTP_FAILED, SEND_OTP_REQUEST, SEND_OTP_SUCCESS } from "../ActionType";

const initialState = {
    loading: false,
    appointment: [],
    error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_ACCOUNT_REQUEST:
            return { loading:true };
        case LOGIN_ACCOUNT_SUCCESS:
            return {
                account: action.payload,
            };
        case SEND_OTP_REQUEST:
            return{
                emailLoading: true
            }
        case SEND_OTP_SUCCESS:
            return{
                emailSent: action.payload
            }
        case SEND_OTP_FAILED:
            return {
                emailSentError: action.error
            };
        case LOGIN_ACCOUNT_FAILED:
            return {
                error: action.error,
            };

        case CHANGE_PASSWORD_REQUEST:
            return{ passwordLoading: true }
        case CHANGE_PASSWORD_SUCCESS:
            return{ passwordResult: action.payload }
        case CHANGE_PASSWORD_FAILED:
            return{ passwordError: action.error }

        case LOGOUT_ACCOUNT_SUCCESS:
            return {}
        default:
            return state;
    }
};

export default reducer;
