import actionTypes from '../actions/actionTypes';

const initialState = {
    errorMessage: null,
    infoMessage: null
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    console.log(`dispatching '${type}'`, payload);
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
        default:
            return state
    }
};