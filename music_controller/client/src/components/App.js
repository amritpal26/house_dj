import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EditRoom from './EditRoom';
import Home from './Home';
import JoinRoom from './JoinRoom';

export default function App() {
    return (
        <div>
            <Router>
                <Switch>
                    <Route path="/create-room" component={ EditRoom }></Route>
                    <Route path="/join_Room" component={ JoinRoom }></Route>
                    <Route exact path="/" component={ Home }></Route>
                </Switch>
            </Router>
        </div>
    );
}