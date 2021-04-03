import React, { useState } from 'react';

import Configs from "../configs";

const DEFAULT_VOTES_TO_SKIP = Configs.constants.DEFAULT_VOTES_TO_SKIP;
const DEFAULT_GUEST_CAN_PAUSE = Configs.constants.DEFAULT_GUEST_CAN_PAUSE;

export default function Room(){
    const [guestCanPause, setGuestCanPause] = useState(DEFAULT_GUEST_CAN_PAUSE);
    const [votesToSkip, setVotesToSkip] = useState(DEFAULT_VOTES_TO_SKIP);
    const [user, setUser] = useState(null);
    const [host, setIsHost] = useState(false);


    return (
        <div>
            <p>Votes to skip: {votesToSkip}</p>
            <p>Guest can pause: {guestCanPause}</p>
        </div>
    );
}