import actionTypes from '../actions/actionTypes';

const initialState = {
    currentRoom: null,
    joinedRoom: null,
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
            const newRooms = [...state.myRoomsList];
            (idx > -1) ? newRooms[idx] = payload : newRooms.push(payload);
            return {
                ...state,
                myRoomsList: newRooms
            }
        case actionTypes.roomActions.SET_JOINED_ROOM:
            return {
                ...state,
                joinedRoom: payload
            }
        case actionTypes.roomActions.GET_ROOM_LIST_SUCCESS:
            return {
                ...state,
                myRoomsList: [...payload]
            }
        case actionTypes.roomActions.LEAVE_ROOM_SUCCESS:
            return {
                ...state,
                currentRoom: null,
                myRoomsList: state.myRoomsList.filter((room) => room.code != payload)
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