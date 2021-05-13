import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router'; 
import { getRoom, currentlyPlaying, playSong, pauseSong, skipSong, leaveRoom } from '../actions/room';
import { requestSpotifyAuthorization } from '../actions/auth';
import { showSuccess, showError } from '../actions/alert';
import { connect } from 'react-redux';
import { makeStyles, Card, Typography, Button } from "@material-ui/core";
import PageLoader from '../components/PageLoader';
import MusicPlayer from '../components/MusicPlayer';

const POLLING_INTERVAL_MS = 1500;
const useStyles = makeStyles((theme) => ({
    playerContainer: { 
        display: 'flex', 
        flexGrow: 1, 
        flexDirection: 'column', 
        justifyContent: 'center' 
    }, 
    buttonsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: theme.spacing(1)
    }
}));

const Room = (props) => {
    const classes = useStyles();
    const history = useHistory();

    const [room, setRoom] = useState(null);
    const [song, setSong] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    var fetchSongInterval = null;

    const onCurrentlyPlayingSuccess = (song) => {
        setSong(song);
    };

    const onSpotifyAuthFail = (err) => {
        history.replace('/');
        props.showError(err || 'could not authenticate spotify account')
    };

    const onGetRoomSuccess = (room) => {
        setRoom(room);
        setIsLoading(false);
    };

    const onGetRoomFailure = (err) => {
        props.showError(err || 'Error getting room');
        history.goBack();
    };

    const onLeaveRoomSuccess = (msg) => {
        history.replace('/');
        props.showSuccess(msg || `Left room: ${room.name}`);
    };

    const onLeaveRoomFailure = (err) => {
        history.replace('/');
        props.showError(err || 'Error leaving room');
    };

    useEffect(() => {
        const roomCode = props.match.params.roomCode;

        if (!room) {
            props.getRoom(roomCode, true, onGetRoomSuccess, onGetRoomFailure);
        } else if (room.is_host && !props.isSpotifyAuthenticated) {
            props.requestSpotifyAuthorization(null, onSpotifyAuthFail);
        } else {
            fetchSongInterval = setInterval(() =>
                props.currentlyPlaying(onCurrentlyPlayingSuccess, null), POLLING_INTERVAL_MS);
        }

        return () => {
            if (fetchSongInterval) {
                clearInterval(fetchSongInterval);
            }
        }
    }, [props.isSpotifyAuthenticated, room]);


    if (isLoading || !room) {
        return <PageLoader></PageLoader>
    }
    return (
        <Card className='card center' >
            <div className='paper'>
                <Typography component='h3' variant='h3'>
                    {room.title}
                </Typography>

                <Typography component='h6' variant='h6'>
                    {`Code: ${room.code}`}
                </Typography>
                <Typography color='textSecondary' variant='subtitle1'>
                    Share this code to let others join
                </Typography>

                <div className={classes.playerContainer}>
                    <div>
                        <MusicPlayer
                            {...song}
                            onPause={() => props.pauseSong(room.code)}
                            onPlay={() => props.playSong(room.code)}
                            onSkip={() => props.skipSong(room.code)} 
                        />
                    </div>
                </div>

                <div className={classes.buttonsContainer}>
                    <Button
                        variant='outlined'
                        onClick={() => history.replace('/')}
                        >Back
                    </Button>
                    {room.is_host && <Button
                        variant='outlined'
                        onClick={() => history.push(`/edit-room/${room.code}`)}
                        >Edit Room
                    </Button>}
                    <Button
                        variant='outlined'
                        onClick={() => props.leaveRoom(room.code, onLeaveRoomSuccess, onLeaveRoomFailure)}
                        >Leave
                    </Button>
                </div>
            </div>
        </Card>
    );
}

const mapStateToProps = state => ({
    isSpotifyAuthenticated: state.auth.isSpotifyAuthenticated
});

const mapActionsToProps = {
    requestSpotifyAuthorization,
    getRoom,
    currentlyPlaying,
    playSong,
    pauseSong,
    leaveRoom,
    skipSong,
    showSuccess,
    showError
};

export default connect(mapStateToProps, mapActionsToProps)(Room);