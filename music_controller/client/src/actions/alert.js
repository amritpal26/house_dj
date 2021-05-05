import actionTypes from './actionTypes';

export const hideError = () => dispatch => {
    dispatch({
        type: actionTypes.alertAction.HIDE_ERROR
    });
}

export const showError = (error) => dispatch => {
    dispatch({
        type: actionTypes.alertAction.SHOW_ERROR,
        payload: error
    });
}