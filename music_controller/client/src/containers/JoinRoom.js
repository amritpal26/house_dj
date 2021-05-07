import React, { useState, useEffect } from 'react';
import Configs from "../configs";
import { useHistory } from 'react-router';
import { joinRoom } from '../actions/room';
import { showError, showSuccess } from '../actions/alert';
import { connect } from 'react-redux';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import {
    makeStyles,
    Box,
    Card,
    Divider,
    Button,
    CircularProgress,
    Typography,
    FormControl,
    Switch,
    FormControlLabel
} from "@material-ui/core";


const DEFAULT_VOTES_TO_SKIP = Configs.constants.DEFAULT_VOTES_TO_SKIP;
const DEFAULT_GUEST_CAN_PAUSE = Configs.constants.DEFAULT_GUEST_CAN_PAUSE;

const useStyles = makeStyles((theme) => ({
    box: {
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '420px',
        minHeight: '420px',
        maxWidth: '720px',
        maxHeight: '720px',
        padding: theme.spacing(2),
    },
    paper: {
        flex: '1 1 auto',
        minHeight: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        height: '100%',
        flexGrow: 1,
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flexGrow: 1,
    },
    buttonsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: theme.spacing(1)
    },
}));

const JoinRoom = ({ joinRoom, showSuccess, showError }) => {
    const classes = useStyles();
    const history = useHistory();
    const [isJoiningRoom, setIsJoiningRoom] = useState(false);
    const [roomCode, setRoomCode] = useState('');

    const onCodeChange = (e) => setRoomCode(e.target.value);

    const onCancel = () => {
        history.replace('/');
    };

    const onJoinRoom = (e) => {
        setIsJoiningRoom(true);

        const onSuccess = () => {
            setIsJoiningRoom(false);
            showSuccess('Joining Room');
            // TODO: navigate to the room page with code;
        }

        const onFailure = (err) => {
            setIsJoiningRoom(false);
            // TODO: Check what error we get back from server and show the error message.
            console.log(`Could not find room with code - ${roomCode}`, err);
            showError(err);
        }

        joinRoom(roomCode, onSuccess, onFailure);
    };

    return (
        <Box className={classes.box}>
            <Card className={classes.card} >
                <div className={classes.paper}>
                    <Typography component='h1' variant='h4'>
                        Join A Room
                    </Typography>

                    {isJoiningRoom && <CircularProgress style={{ position: 'absolute', top: '50%', zIndex: 100 }} />}
                    <ValidatorForm
                        className={classes.form}
                        onSubmit={onJoinRoom}>
                        <div className={classes.contentContainer}>
                            <TextValidator
                                fullWidth
                                label='Room Code'
                                disabled={isJoiningRoom}
                                value={roomCode}
                                onChange={onCodeChange}
                                validators={['required']}
                                errorMessages={['Room Code is required']}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div className={classes.buttonsContainer}>
                            <Button
                                variant='outlined'
                                disabled={isJoiningRoom}
                                onClick={onCancel}
                            >Cancel
                            </Button>
                            <Button
                                variant='outlined'
                                disabled={isJoiningRoom}
                                type='submit'
                            >Join
                            </Button>
                        </div>
                    </ValidatorForm>
                </div>
            </Card>
        </Box>
    );
}

export default connect(null, { joinRoom, showSuccess, showError })(JoinRoom);