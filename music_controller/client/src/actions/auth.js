import axios from 'axios';
import actionTypes from './actionTypes';

const URL_RETREIVE_AUTHENTICATED_USER = '/auth/users/me/';
const URL_CHECK_USER_AUTHENTICATED_JWT = '/auth/jwt/verify/';
const URL_GOOGLE_OAUTH_2 = '/auth/o/google-oauth2/';
const URL_FACEBOOK_OAUTH_2 = '/auth/o/facebook/';
const URL_LOGIN_USER = '/auth/jwt/create/';
const URL_SIGNUP_USER = '/auth/users/';
const URL_USER_ACTIVATION = '/auth/users/activation/';

export const loadUser = (onSuccess, onFailure) => async dispatch => {
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

export const checkAuthenticated = (onSuccess, onFailure) => async dispatch => {
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
                onSuccess && onSuccess();
            } else {
                dispatch({
                    type: actionTypes.authActions.AUTHENTICATION_FAIL
                });
                onFailure && onFailure(res.data.code);
            }
        } catch (err) {
            dispatch({
                type: actionTypes.authActions.AUTHENTICATION_FAIL
            });
            onFailure && onFailure(err);
        }
    } else {
        dispatch({
            type: actionTypes.authActions.AUTHENTICATION_FAIL
        });
        onFailure && onFailure(null);
    }
};

export const googleAuthenticate = (state, code, onSuccess, onFailure) => async dispatch => {
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
            onSuccess && onSuccess();
        } catch (err) {
            dispatch({
                type: actionTypes.authActions.GOOGLE_AUTH_FAIL
            });
            onFailure(err);
        }
    } else {

    }
};

export const facebookAuthenticate = (state, code, onSuccess, onFailure) => async dispatch => {
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
            const res = await axios.post(`${process.env.REACT_APP_API_URL}${URL_FACEBOOK_OAUTH_2}?${formBody}`, config);
            
            dispatch({
                type: actionTypes.authActions.FACEBOOK_AUTH_SUCCESS,
                payload: res.data
            });

            dispatch(loadUser());
            onSuccess && onSuccess();
        } catch (err) {
            dispatch({
                type: actionTypes.authActions.FACEBOOK_AUTH_FAIL
            });
            onFailure(err);
        }
    } else {

    }
};

export const login = (email, password, onSuccess, onFailure) => async dispatch =>  {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}${URL_LOGIN_USER}`, body, config);
        
        onSuccess && onSuccess();
        dispatch({
            type: actionTypes.authActions.LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (err) {
        onSuccess && onFailure();
        dispatch({
            type: actionTypes.authActions.LOGIN_FAIL
        })
    }
};

export const signup = (first_name, last_name, email, password, re_password, onSuccess, onFailure) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ first_name, last_name, email, password, re_password });
    console.log('signUp called', body);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}${URL_SIGNUP_USER}`, body, config);
        
        onSuccess && onSuccess();
        dispatch({
            type: actionTypes.authActions.SIGNUP_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        onSuccess && onFailure();
        dispatch({
            type: actionTypes.authActions.SIGNUP_FAIL
        })
    }
};

export const activate = (uid, token, onSuccess, onFailure) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}${URL_USER_ACTIVATION}`, body, config);
        
        onSuccess && onSuccess();
        dispatch({
            type: actionTypes.authActions.ACTIVATION_SUCCESS
        });
    } catch (err) {
        onSuccess && onFailure();
        dispatch({
            type: actionTypes.authActions.ACTIVATION_FAIL
        });
    }
};

export const logout = (onSuccess) => async dispatch => {
    dispatch({
        type: actionTypes.authActions.LOGOUT
    });

    onSuccess && onSuccess();
};