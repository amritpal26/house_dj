import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EditRoom from './components/EditRoom';
import Home from './components/Home';
import Room from './components/Room';
import JoinRoom from './components/JoinRoom';
import Navbar from './components/Navbar';
import Login from './containers/Login';
import Signup from './containers/Signup';
import ResetPassword from './containers/ResetPassword';

import { Provider } from 'react-redux';
import store from './store';

import Bubbles from './particles/Bubbles';
import Layout from './particles/Layout';
import theme from './theme';
import { ThemeProvider } from '@material-ui/styles';

export default function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Router>
                    <div>
                        <Bubbles />
                        <div id="main-content-container">
                            <Layout >
                                <Switch>
                                    <Route exact path='/login' component={ Login } />
                                    <Route exact path='/signup' component={ Signup } />
                                    <Route exact path='/reset-password' component={ ResetPassword } />
                                    <Route path="/create-room" component={ EditRoom }></Route>
                                    <Route path="/room/:roomCode" component={ Room }></Route>
                                    <Route path="/join_Room" component={ JoinRoom }></Route>
                                    <Route exact path="/" component={ Home }></Route>
                                </Switch>
                            </Layout>
                        </div>
                    </div>
                </Router>
            </ThemeProvider>
        </Provider>
    );
}