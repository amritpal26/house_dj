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