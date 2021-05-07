import actionTypes from '../actions/actionTypes';

const initialState = {
    myRoomsList: []
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    console.log(`dispatching '${type}'`, payload);
    switch(type) {
        case actionTypes.roomActions.CREATE_ROOM_SUCCESS:
            state.myRoomsList.push(payload)
            return state;
        default:
            return state
    }
};