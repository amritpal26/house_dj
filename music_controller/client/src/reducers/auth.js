import actionTypes from '../actions/actionTypes'

const initialState = {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    isAuthenticated: null,
    user: null,
    isSpotifyAuthenticated: false,
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
        case actionTypes.authActions.FACEBOOK_AUTH_SUCCESS:
            localStorage.setItem('accessToken', payload.access);
            localStorage.setItem('refreshToken', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                accessToken: payload.access,
                refreshToken: payload.refresh
            }
        case actionTypes.authActions.SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }
        case actionTypes.authActions.USER_PROFILE_SAVE_SUCCESS:
        case actionTypes.authActions.USER_LOAD_SUCCESS:
            return {
                ...state,
                user: payload
            }
        case actionTypes.authActions.AUTHENTICATION_FAIL:
        case actionTypes.authActions.LOGIN_FAIL:
        case actionTypes.authActions.GOOGLE_AUTH_FAIL:
        case actionTypes.authActions.FACEBOOK_AUTH_FAIL:
        case actionTypes.authActions.SIGNUP_FAIL:
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
        case actionTypes.authActions.USER_PROFILE_SAVE_FAIL:
        case actionTypes.authActions.PASSWORD_RESET_SUCCESS:
        case actionTypes.authActions.PASSWORD_RESET_FAIL:
        case actionTypes.authActions.PASSWORD_RESET_CONFIRM_SUCCESS:
        case actionTypes.authActions.PASSWORD_RESET_CONFIRM_FAIL:
        case actionTypes.authActions.ACTIVATION_SUCCESS:
        case actionTypes.authActions.ACTIVATION_FAIL:
            return {
                ...state
            }
        case actionTypes.authActions.SPOTIFY_AUTH_SUCCESS:
            return {
                ...state,
                isSpotifyAuthenticated: true
            }
        case actionTypes.authActions.SPOTIFY_AUTH_FAIL:
            return {
                ...state,
                isSpotifyAuthenticated: false
            }
        default:
            return state
    }
};