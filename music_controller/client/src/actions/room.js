import axios from 'axios';
import actionTypes from './actionTypes';

const URL_CREATE_ROOM = '/api/create-room';

export const createRoom = (title, votes_to_skip, guest_can_pause,onSuccess, onFailure) => async dispatch => {
    if (!title || !votes_to_skip || !guest_can_pause) {
        onFailure && onFailure('Please fill all the details.');
        return;
    }
    
    if (localStorage.getItem('accessToken')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('accessToken')}`,
                'Accept': 'application/json'
            }
        };

        const body = JSON.stringify({ title, votes_to_skip, guest_can_pause });

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}${URL_CREATE_ROOM}`, body, config);

            dispatch({
                type: actionTypes.roomActions.CREATE_ROOM_SUCCESS,
                payload: res.data
            });
            console.log(res);
            // TODO: dispatch success message and show the snackbar message.
            onSuccess && onSuccess(res);
        } catch (err) {
            dispatch({
                type: actionTypes.roomActions.CREATE_ROOM_FAIL
            });
            onFailure && onFailure(err);
            // TODO: dispatch Fail message and show the snackbar message.
        }
    } else {
        dispatch({
            type: actionTypes.roomActions.CREATE_ROOM_FAIL
        });
        onFailure && onFailure('User session expired');
        // TODO: dispatch Fail message and show the snackbar message.
    }
};