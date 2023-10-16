import { LOGIN_ACCOUNT_FAILED, LOGIN_ACCOUNT_SUCCESS, LOGOUT_ACCOUNT_SUCCESS } from "../ActionType";

const initialState = {
    loading: false,
    appointment: [],
    error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_ACCOUNT_SUCCESS:
            return {
                account: action.payload,
                error:null,
                loading: false
            };
        case LOGIN_ACCOUNT_FAILED:
            return {
                account:null,
                error: action.error,
                loading: false
            };
        case LOGOUT_ACCOUNT_SUCCESS:
            return {}
        default:
            return state;
    }
};

export default reducer;
