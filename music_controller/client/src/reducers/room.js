import actionTypes from '../actions/actionTypes';

const initialState = {
    currentRoom: null,
    myRoomsList: []
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case actionTypes.roomActions.CREATE_ROOM_SUCCESS:
            state.myRoomsList.push(payload)
            return {
                ...state
            };
        case actionTypes.roomActions.JOIN_ROOM_SUCCESS:
            return {
                ...state,
                currentRoom: payload
            }
        case actionTypes.roomActions.UPDATE_ROOM_SUCCESS:
        case actionTypes.roomActions.GET_ROOM_SUCCESS:
            const idx = state.myRoomsList.findIndex((room) => room.id === payload.id);
            (idx > -1) ? state.myRoomsList[idx] = payload : state.myRoomsList.push(payload);
            return {
                ...state,
                currentRoom: payload
            }
        case actionTypes.roomActions.GET_ROOM_LIST_SUCCESS:
            console.log(payload)
            return {
                ...state,
                myRoomsList: payload
            }
        case actionTypes.roomActions.LEAVE_ROOM_SUCCESS:
            return {
                ...state,
                currentRoom: null
            }
        case actionTypes.roomActions.CREATE_ROOM_FAILURE:
        case actionTypes.roomActions.JOIN_ROOM_FAILURE:
        case actionTypes.roomActions.GET_ROOM_FAILURE:
        case actionTypes.roomActions.GET_ROOM_LIST_FAILURE:
        case actionTypes.roomActions.UPDATE_ROOM_FAILURE:
        case actionTypes.roomActions.LEAVE_ROOM_FAILURE:
            return state
        default:
            return state
    }
};