import actionTypes from '../actions/actionTypes';

const initialState = {
    roomList: [
        { id: 1, title: 'Room1', votes_to_skip: 5, guest_can_pause: true },
        { id: 2, title: 'Room2', votes_to_skip: 4, guest_can_pause: false },
        { id: 3, title: 'Room3', votes_to_skip: 5, guest_can_pause: true },
        { id: 4, title: 'Room4', votes_to_skip: 4, guest_can_pause: false },
        { id: 5, title: 'Room5', votes_to_skip: 5, guest_can_pause: true },
        { id: 6, title: 'Room6', votes_to_skip: 4, guest_can_pause: false },
        { id: 7, title: 'Room7', votes_to_skip: 5, guest_can_pause: true },
        { id: 8, title: 'Room8', votes_to_skip: 4, guest_can_pause: false },
        { id: 9, title: 'Room9', votes_to_skip: 5, guest_can_pause: true },
        { id: 10, title: 'Room10', votes_to_skip: 4, guest_can_pause: false },
    ]
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    console.log(`dispatching '${type}'`, payload);
    switch(type) {
        default:
            return state
    }
};