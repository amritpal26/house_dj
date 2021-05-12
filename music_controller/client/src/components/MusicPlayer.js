import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Card, IconButton, LinearProgress, Avatar } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';


const MusicPlayer = (props) => {

    const progress = props.duration ? (props.time / props.duration) * 100 : 0;

    return (
        <Card elevation={10}>
            <Grid container alignItems='center'>
                <Grid item align='center' xs={4}>
                    <img src={props.image_url} height='100%' width='100%' />
                </Grid>

                <Grid item align='center' xs={8}>
                    <Typography component='h5' variant='h4'>
                        {props.title}
                    </Typography>
                    <Typography color='textSecondary' variant='subtitle1'>
                        {props.artist}
                    </Typography>

                    <Grid container alignItems='center' justify='center'>
                        <Grid item align='center'>
                            {props.is_playing && <IconButton onClick={props.onPause}>
                                <Avatar><PauseIcon /></Avatar>
                            </IconButton>}

                            {!props.is_playing && <IconButton onClick={props.onPlay}>
                                <Avatar><PlayArrowIcon /></Avatar>
                            </IconButton>}

                            <IconButton onClick={props.onSkip}>
                                <Avatar><SkipNextIcon /></Avatar>
                            </IconButton>
                        </Grid>

                        <Grid item align='center'>
                            <Typography color='textSecondary' variant='subtitle1'>
                                {`votes: ${props.votes} / ${props.votes_required}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <LinearProgress variant='determinate' value={progress} />
        </Card >
    );
};

MusicPlayer.propTypes = {
    title: PropTypes.string,
    artist: PropTypes.string,
    duration: PropTypes.number,
    time: PropTypes.number,
    image_url: PropTypes.string,
    is_playing: PropTypes.bool,
    votes: PropTypes.number,
    votes_required: PropTypes.number,

    onPause: PropTypes.func,
    onPlay: PropTypes.func,
    onSkip: PropTypes.func
};

MusicPlayer.defaultProps = {
    title: '',
    artist: '',
    duration: 1,
    time: 0,
    image_url: '',
    is_playing: false,
    votes: 0,
    votes_required: 0,

    onPause: null,
    onPlay: null,
    onSkip: null
};

export default MusicPlayer;
