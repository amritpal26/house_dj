import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import room from './room';

export default combineReducers({
    auth,
    alert,
    room
});