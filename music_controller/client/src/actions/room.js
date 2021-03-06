import axios from 'axios';
import actionTypes from './actionTypes';

const URL_CREATE_ROOM = '/api/create-room';
const URL_JOIN_ROOM = '/api/join-room';
const URL_GET_ROOM = '/api/get-room';
const URL_UPDATE_ROOM = '/api/update-room';
const URL_LEAVE_ROOM = '/api/leave-room';
const URL_GET_MY_ROOMS = '/api/get-my-rooms';

const URL_GET_CURRENTLY_PLAYING = '/spotify/currently-playing';
const URL_SPOTIFY_PLAY = '/spotify/play';
const URL_SPOTIFY_PAUSE = '/spotify/pause';
const URL_SPOTIFY_SKIP = '/spotify/skip';

const isBoolean = (val) => {
    return typeof val == 'boolean';
}

const getJwtHeader = () => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('accessToken')}`,
            'Accept': 'application/json'
        }
    };
};

export const createRoom = (title, votes_to_skip, guest_can_pause, onSuccess, onFailure) => async dispatch => {
    if (!title || !votes_to_skip || !isBoolean(guest_can_pause)) {
        onFailure && onFailure('Please fill all the details.');
        return;
    }
    
    if (localStorage.getItem('accessToken')) {
        const config = getJwtHeader();

        const body = JSON.stringify({ title, votes_to_skip, guest_can_pause });

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}${URL_CREATE_ROOM}`, body, config);

            dispatch({
                type: actionTypes.roomActions.CREATE_ROOM_SUCCESS,
                payload: res.data
            });
            onSuccess && onSuccess('Room created!');
        } catch (err) {
            dispatch({
                type: actionTypes.roomActions.CREATE_ROOM_FAILURE
            });

            const errorMessage = (err.response && err.response.data) || 'Failed to create room';
            onFailure && onFailure(errorMessage);
        }
    } else {
        dispatch({
            type: actionTypes.roomActions.CREATE_ROOM_FAILURE
        });
        onFailure && onFailure('User session expired');
    }
};

export const joinRoom = (code, onSuccess, onFailure) => async dispatch => {
    if (!code) {
        onFailure && onFailure('Please fill all the details.');
        return;
    }
    
    if (localStorage.getItem('accessToken')) {
        const config = getJwtHeader();

        const body = JSON.stringify({ code });

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}${URL_JOIN_ROOM}`, body, config);

            dispatch({
                type: actionTypes.roomActions.JOIN_ROOM_SUCCESS,
                payload: res.data
            });
            onSuccess && onSuccess(res.data);
        } catch (err) {
            dispatch({
                type: actionTypes.roomActions.JOIN_ROOM_FAILURE
            });

            const errorMessage = (err.response && err.response.data) || 'Failed to join room';
            onFailure && onFailure(errorMessage);
        }
    } else {
        dispatch({
            type: actionTypes.roomActions.JOIN_ROOM_FAILURE
        });
        onFailure && onFailure('User session expired');
    }
};

export const getRoom = (code, isJoinedRoom, onSuccess, onFailure) => async dispatch => {
    if (!code) {
        onFailure && onFailure('Please fill all the details.');
        return;
    }

    if (localStorage.getItem('accessToken')) {
        const config = getJwtHeader();

        const details = {
            'code': code
        }

        const params = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}${URL_GET_ROOM}?${params}`, config);

            dispatch({
                type: actionTypes.roomActions.GET_ROOM_SUCCESS,
                payload: res.data
            });
            if (isJoinedRoom) {
                dispatch({
                    type: actionTypes.roomActions.SET_JOINED_ROOM,
                    payload: res.data
                });
            }
            onSuccess && onSuccess(res.data);
        } catch (err) {
            // TODO: Parse the error code and return apt message to show to user.
            dispatch({
                type: actionTypes.roomActions.GET_ROOM_FAILURE
            });

            const errorMessage = (err.response && err.response.data) || 'Failed to get room';
            onFailure && onFailure(errorMessage);
        }
    } else {
        dispatch({
            type: actionTypes.roomActions.GET_ROOM_FAILURE
        });
        onFailure && onFailure('User session expired');
    }
};

export const leaveRoom = (code, onSuccess, onFailure) => async dispatch => {
    if (!code) {
        onFailure && onFailure('Please fill all the details.');
        return;
    }

    if (localStorage.getItem('accessToken')) {
        const config = getJwtHeader();

        const body = JSON.stringify({ code });

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}${URL_LEAVE_ROOM}`, body, config);

            dispatch({
                type: actionTypes.roomActions.LEAVE_ROOM_SUCCESS,
                payload: code
            });
            onSuccess && onSuccess(res.data);
        } catch (err) {
            dispatch({
                type: actionTypes.roomActions.LEAVE_ROOM_FAILURE
            });

            const errorMessage = (err.response && err.response.data) || 'Failed to leave room';
            onFailure && onFailure(errorMessage);
        }
    } else {
        dispatch({
            type: actionTypes.roomActions.LEAVE_ROOM_FAILURE
        });
        onFailure && onFailure('User session expired');
    }
};

export const updateRoom = (code, title, votes_to_skip, guest_can_pause, onSuccess, onFailure) => async dispatch => {
    if (!code || !title || !votes_to_skip || !isBoolean(guest_can_pause)) {
        onFailure && onFailure('Please fill all the details.');
        return;
    }

    if (localStorage.getItem('accessToken')) {
        const config = getJwtHeader();

        const body = JSON.stringify({ code, title, votes_to_skip, guest_can_pause });

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}${URL_UPDATE_ROOM}`, body, config);

            dispatch({
                type: actionTypes.roomActions.UPDATE_ROOM_SUCCESS,
                payload: res.data
            });
            onSuccess && onSuccess('Room updated!');
        } catch (err) {
            dispatch({
                type: actionTypes.roomActions.UPDATE_ROOM_FAILURE
            });

            const errorMessage = (err.response && err.response.data) || 'Failed to update room';
            onFailure && onFailure(errorMessage);
        }
    } else {
        dispatch({
            type: actionTypes.roomActions.UPDATE_ROOM_FAILURE
        });
        onFailure && onFailure('User session expired');
    }
};

export const getMyRooms = (onSuccess, onFailure) => async dispatch => {
    if (localStorage.getItem('accessToken')) {
        const config = getJwtHeader();

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}${URL_GET_MY_ROOMS}`, config);

            dispatch({
                type: actionTypes.roomActions.GET_ROOM_LIST_SUCCESS,
                payload: res.data
            });

            onSuccess && onSuccess(res.data);
        } catch (err) {
            dispatch({
                type: actionTypes.roomActions.GET_ROOM_LIST_FAILURE
            });

            const errorMessage = (err.response && err.response.data) || 'Failed to get room';
            onFailure && onFailure(errorMessage);
        }
    } else {
        dispatch({
            type: actionTypes.roomActions.GET_ROOM_LIST_FAILURE
        });
        onFailure && onFailure('User session expired');
    }
}


// ----------------------------------------------------
// Spotify
// ----------------------------------------------------
export const currentlyPlaying = (onSuccess, onFailure) => async dispatch => {
    if (localStorage.getItem('accessToken')) {
        const config = getJwtHeader();

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}${URL_GET_CURRENTLY_PLAYING}`, config);

            dispatch({
                type: actionTypes.roomActions.GET_CURRENTLY_PLAYING_SUCCESS,
                payload: res.data
            });
            onSuccess && onSuccess(res.data);
        } catch (err) {
            dispatch({
                type: actionTypes.roomActions.GET_CURRENTLY_PLAYING_FAIL
            });
            const errorMessage = (err.response && err.response.data) || 'Failed to get current song';
            onFailure && onFailure(errorMessage);
        }
    } else {
        dispatch({
            type: actionTypes.roomActions.GET_CURRENTLY_PLAYING_FAIL
        });
        onFailure && onFailure('User session expired');
    }
};

export const playSong = (room_code, onSuccess, onFailure) => async dispatch => {
    if (localStorage.getItem('accessToken')) {
        const config = getJwtHeader();

        const body = JSON.stringify({ room_code });
        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}${URL_SPOTIFY_PLAY}`, body, config);

            dispatch({
                type: actionTypes.roomActions.SPOTIFY_PLAY_SUCCESS,
                payload: res.data
            });
            onSuccess && onSuccess(res.data);
        } catch (err) {
            dispatch({
                type: actionTypes.roomActions.SPOTIFY_PLAY_FAIL
            });
            const errorMessage = (err.response && err.response.data) || 'Failed to play song';
            onFailure && onFailure(errorMessage);
        }
    } else {
        dispatch({
            type: actionTypes.roomActions.SPOTIFY_PLAY_FAIL
        });
        onFailure && onFailure('User session expired');
    }
};

export const pauseSong = (room_code, onSuccess, onFailure) => async dispatch => {
    if (localStorage.getItem('accessToken')) {
        const config = getJwtHeader();

        const body = JSON.stringify({ room_code });
        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}${URL_SPOTIFY_PAUSE}`, body, config);

            dispatch({
                type: actionTypes.roomActions.SPOTIFY_PAUSE_SUCCESS,
                payload: res.data
            });
            onSuccess && onSuccess(res.data);
        } catch (err) {
            dispatch({
                type: actionTypes.roomActions.SPOTIFY_PAUSE_FAIL
            });
            const errorMessage = (err.response && err.response.data) || 'Failed to pause song';
            onFailure && onFailure(errorMessage);
        }
    } else {
        dispatch({
            type: actionTypes.roomActions.SPOTIFY_PAUSE_FAIL
        });
        onFailure && onFailure('User session expired');
    }
}

export const skipSong = (room_code, onSuccess, onFailure) => async dispatch => {
    if (localStorage.getItem('accessToken')) {
        const config = getJwtHeader();

        const body = JSON.stringify({ room_code });
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}${URL_SPOTIFY_SKIP}`, body, config);

            dispatch({
                type: actionTypes.roomActions.SPOTIFY_SKIP_SUCCESS,
                payload: res.data
            });
            onSuccess && onSuccess(res.data);
        } catch (err) {
            dispatch({
                type: actionTypes.roomActions.SPOTIFY_SKIP_FAIL
            });
            const errorMessage = (err.response && err.response.data) || '';
            onFailure && onFailure(errorMessage);
        }
    } else {
        dispatch({
            type: actionTypes.roomActions.SPOTIFY_SKIP_FAIL
        });
        onFailure && onFailure('User session expired');
    }
};