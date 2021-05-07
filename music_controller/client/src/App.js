import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Room from './components/Room';
import JoinRoom from './components/JoinRoom';
import { Provider } from 'react-redux';

import theme from './theme';
import store from './store';
import Layout from './hocs/Layout';
import Bubbles from './particles/Bubbles';
import { ThemeProvider } from '@material-ui/styles';

// Auth
import Login from './containers/Login';
import Signup from './containers/Signup';
import Google from './containers/Google';
import Facebook from './containers/Facebook';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';
import Activate from './containers/Activate';

// Party containers
import Home from './containers/Home';
import EditRoom from './containers/EditRoom';

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
                                    <Route path='/create-room' component={ EditRoom }></Route>
                                    <Route path="/edit-room/:roomCode" component={ EditRoom }></Route>
                                    <Route path="/room/:roomCode" component={ Room }></Route>
                                    <Route path="/join-room" component={ JoinRoom }></Route>
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