import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router'; import { getRoom, currentlyPlaying, playSong, pauseSong, skipSong } from '../actions/room';
import { requestSpotifyAuthorization } from '../actions/auth';
import { showSuccess, showError } from '../actions/alert';
import { connect } from 'react-redux';
import { makeStyles, Card } from "@material-ui/core";
import PageLoader from '../components/PageLoader';
import MusicPlayer from '../components/MusicPlayer';

const POLLING_INTERVAL_MS = 1500;
const useStyles = makeStyles((theme) => ({
    loader: {
        position: 'absolute',
        top: '50%',
        zIndex: 100
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
                {`Room: ${room && room.title}`}

                <MusicPlayer
                    {...song}
                    onPause={() => props.pauseSong(room.code)}
                    onPlay={() => props.playSong(room.code)}
                    onSkip={() => props.skipSong(room.code)} />
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
    skipSong,
    showSuccess,
    showError
};

export default connect(mapStateToProps, mapActionsToProps)(Room);