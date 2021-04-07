import axios from 'axios';
import actionTypes from './actionTypes';

export const login = (email, password) => dispatch =>  {
    console.log('called action');
};

export const signUp = (firstName, lastName, email, password) => dispatch => {
    console.log('signUp called');
};