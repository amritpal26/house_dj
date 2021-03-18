import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateRoom from './CreateRoom';
import Home from './Home';
import JoinRoom from './JoinRoom';

export default function App() {
    return (
        <div>
            <Router>
                <Switch>
                    <Route path="/create_room" component={ CreateRoom }></Route>
                    <Route path="/join_Room" component={ JoinRoom }></Route>
                    <Route exact path="/" component={ Home }></Route>
                </Switch>
            </Router>
        </div>
    );
}