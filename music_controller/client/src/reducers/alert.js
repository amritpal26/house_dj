import actionTypes from '../actions/actionTypes';

const initialState = {
    errorMessage: null,
    successMessage: null
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case actionTypes.alertActions.HIDE_ERROR:
            return {
                ...state,
                errorMessage: null
            }
        case actionTypes.alertActions.SHOW_ERROR:
            return {
                ...state,
                errorMessage: payload
            }
        case actionTypes.alertActions.HIDE_SUCCESS:
            return {
                ...state,
                successMessage: null
            }
        case actionTypes.alertActions.SHOW_SUCCESS:
            return {
                ...state,
                successMessage: payload
            }
        default:
            return state
    }
};