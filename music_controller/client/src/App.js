import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import theme from './theme';
import store from './store';
import Layout from './hocs/Layout';
import Bubbles from './particles/Bubbles';
import { ThemeProvider } from '@material-ui/styles';
import './index.scss'

// Auth
import Login from './containers/Login';
import Signup from './containers/Signup';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';
import Activate from './containers/Activate';
import UpdateProfile from './containers/UpdateProfile';

// Redirects
import Google from './containers/Google';
import Facebook from './containers/Facebook';
import Spotify from './containers/Spotify';

// Party containers
import Room from './containers/Room';
import Home from './containers/Home';
import EditRoom from './containers/EditRoom';
import JoinRoom from './containers/JoinRoom';

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
                                    <Route exact path='/facebook' component={ Facebook } />
                                    <Route exact path='/google' component={ Google } />
                                    <Route exact path='/activate/:uid/:token' component={ Activate } />
                                    <Route exact path='/reset-password' component={ ResetPassword } />
                                    <Route exact path='/password/reset/confirm/:uid/:token' component={ResetPasswordConfirm} />
                                    <Route exact path='/update-profile' component={ UpdateProfile } />
                                    <Route exact path='/create-room' component={ EditRoom }></Route>
                                    <Route exact path="/edit-room/:roomCode" component={ EditRoom }></Route>
                                    <Route exact path="/join-room" component={ JoinRoom }></Route>
                                    <Route exact path="/" component={ Home }></Route>
                                    <Route exact path="/room/:roomCode" component={ Room }></Route>
                                    <Route exact path="/spotify" component={ Spotify }></Route>
                                </Switch>
                            </Layout>
                        </div>
                    </div>
                </Router>
            </ThemeProvider>
        </Provider>
    );
}