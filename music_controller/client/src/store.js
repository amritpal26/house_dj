
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';
import throttle from 'lodash/throttle';

const middleware = [thunk];

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {
    }
};

const persistedState = loadState();

const store = createStore(
    rootReducer,
    persistedState,
    composeWithDevTools(applyMiddleware(...middleware))
);

store.subscribe(throttle(() => {
    console.log('saving state');
    saveState({
        rooms: store.getState().rooms,
        auth: store.getState().auth,
    })
}, 1000));

export default store;