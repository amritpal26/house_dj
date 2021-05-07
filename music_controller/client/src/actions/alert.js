import actionTypes from './actionTypes';

export const hideError = () => dispatch => {
    dispatch({
        type: actionTypes.alertActions.HIDE_ERROR
    });
}

export const showError = (error) => dispatch => {
    dispatch({
        type: actionTypes.alertActions.SHOW_ERROR,
        payload: error
    });
}

export const hideSuccess = () => dispatch => {
    dispatch({
        type: actionTypes.alertActions.HIDE_SUCCESS
    });
}

export const showSuccess = (successMessage) => dispatch => {
    console.log('show success called');
    dispatch({
        type: actionTypes.alertActions.SHOW_SUCCESS,
        payload: successMessage
    });
}