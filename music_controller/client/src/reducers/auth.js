import actionTypes from '../actions/actionTypes'

const initialState = {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    isAuthenticated: null,
    user: null
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    console.log(`dispatching '${type}'`, payload);
    switch(type) {
        case actionTypes.authActions.AUTHENTICATION_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case actionTypes.authActions.LOGIN_SUCCESS:
        case actionTypes.authActions.GOOGLE_AUTH_SUCCESS:
            localStorage.setItem('accessToken', payload.accessToken);
            localStorage.setItem('refreshToken', payload.refreshToken);
            return {
                ...state,
                isAuthenticated: true,
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken
            }
        case actionTypes.authActions.USER_LOAD_SUCCESS:
            return {
                ...state,
                user: payload
            }
        case actionTypes.authActions.AUTHENTICATION_FAIL:
            return {
                ...state,
                isAuthenticated: false
            }
        case actionTypes.authActions.LOGIN_FAIL:
        case actionTypes.authActions.GOOGLE_AUTH_FAIL:
        case actionTypes.authActions.LOGOUT:
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return {
                ...state,
                isAuthenticated: false,
                accessToken: null,
                refreshToken: null,
                user: null
            }
        case actionTypes.authActions.USER_LOAD_FAIL:
            return {
                ...state,
                user: null
            }
        default:
            return state
    }
};