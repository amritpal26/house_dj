import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { getRoom } from '../actions/room';
import { requestSpotifyAuthorization } from '../actions/auth';
import { showSuccess, showError } from '../actions/alert';
import { connect } from 'react-redux';
import { makeStyles, Card, Button, CircularProgress, Typography, FormControl, Switch, FormControlLabel } from "@material-ui/core";
import PageLoader from '../components/PageLoader'; 


const useStyles = makeStyles((theme) => ({
    loader: { 
        position: 'absolute',
        top: '50%',
        zIndex: 100 
    }
}));

const Room = ({ isSpotifyAuthenticated, requestSpotifyAuthorization, getRoom, showSuccess, showError, match }) => {
    const classes = useStyles();
    const history = useHistory();

    const [room, setRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const onSpotifyAuthFail = (err) => {
            history.replace('/');
            showError(err || 'could not authenticate spotify account')
        };

        const onGetRoomSuccess = (room) => {
            setRoom(room);
            setIsLoading(false);
        };

        const onGetRoomFailure = (err) => {
            showError(err || 'Error getting room');
            history.goBack();
        };

        const roomCode = match.params.roomCode;
        if (!isSpotifyAuthenticated) {
            requestSpotifyAuthorization(null, onSpotifyAuthFail);
        } else if (!room) {
            getRoom(roomCode, true, onGetRoomSuccess, onGetRoomFailure);
        } 
    }, [room]);

    if (isLoading) {
        return <PageLoader></PageLoader>
    }
    return (
        <Card className='card center' >
            <div className='paper'>
                {`Room: ${room && room.title}`}
            </div>
        </Card>
    );
}

const mapStateToProps = state => ({
    isSpotifyAuthenticated: state.auth.isSpotifyAuthenticated
});

export default connect(mapStateToProps, 
    { 
        requestSpotifyAuthorization,
        getRoom,
        showSuccess, 
        showError 
    }
)(Room);