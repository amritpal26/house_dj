import axios from 'axios';
import actionTypes from './actionTypes';

const URL_RETREIVE_AUTHENTICATED_USER = '/auth/users/me/';
const URL_GOOGLE_OAUTH_2 = '/auth/o/google-oauth2/';
const URL_CHECK_USER_AUTHENTICATED_JWT = '/auth/jwt/verify/';
const URL_SIGNUP_USER = '/auth/users/';
const URL_USER_ACTIVATION = '/auth/users/activation/';

export const loadUser = () => async dispatch => {
    if (localStorage.getItem('accessToken')) {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('accessToken')}`,
                'Accept': 'application/json'
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}${URL_RETREIVE_AUTHENTICATED_USER}`, config);

            dispatch({
                type: actionTypes.authActions.USER_LOAD_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: actionTypes.authActions.USER_LOAD_FAIL
            });
        }
    } else {
        dispatch({
            type: actionTypes.authActions.USER_LOAD_FAIL
        });
    }
};

export const checkAuthenticated = () => async dispatch => {
    if (localStorage.getItem('accessToken')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const body = JSON.stringify({ token: localStorage.getItem('accessToken') });
        
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}${URL_CHECK_USER_AUTHENTICATED_JWT}`, body, config);

            if (res.data.code !== 'token_not_valid') {
                dispatch({
                    type: actionTypes.authActions.AUTHENTICATION_SUCCESS
                });
            } else {
                dispatch({
                    type: actionTypes.authActions.AUTHENTICATION_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: actionTypes.authActions.AUTHENTICATION_FAIL
            });
        }
    } else {
        dispatch({
            type: actionTypes.authActions.AUTHENTICATION_FAIL
        });
    }
};

export const googleAuthenticate = (state, code) => async dispatch => {
    if (state && code && !localStorage.getItem('accessToken')) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        const details = {
            'state': state,
            'code': code
        };

        const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}${URL_GOOGLE_OAUTH_2}?${formBody}`, config);
            
            dispatch({
                type: actionTypes.authActions.GOOGLE_AUTH_SUCCESS,
                payload: res.data
            });

            dispatch(loadUser());
        } catch (err) {
            dispatch({
                type: actionTypes.authActions.GOOGLE_AUTH_FAIL
            });
        }
    } else {

    }
};

export const login = (email, password) => dispatch =>  {
    console.log('called action');
};

export const signUp = (first_name, last_name, email, password, re_password, onSuccess, onFailure) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ first_name, last_name, email, password, re_password });
    console.log('signUp called', body);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}${URL_SIGNUP_USER}`, body, config);
        
        onSuccess();
        dispatch({
            type: actionTypes.authActions.SIGNUP_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        onFailure();
        dispatch({
            type: actionTypes.authActions.SIGNUP_FAIL
        })
    }
};

export const verify = (uid, token, onSuccess, onFailure) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}${URL_USER_ACTIVATION}`, body, config);
        
        onSuccess();
        dispatch({
            type: actionTypes.authActions.ACTIVATION_SUCCESS
        });
    } catch (err) {
        onFailure();
        dispatch({
            type: actionTypes.authActions.ACTIVATION_FAIL
        });
    }
};

export const logout = () => async dispatch => {
    dispatch({
        type: actionTypes.authActions.LOGOUT
    });
};