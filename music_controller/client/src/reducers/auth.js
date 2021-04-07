import actionTypes from '../actions/actionTypes'

const initialState = {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    isAuthenticated: null,
    user: null
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case actionTypes.authActions.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        default:
            return state
    }
};