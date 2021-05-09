import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { joinRoom } from '../actions/room';
import { showError, showSuccess } from '../actions/alert';
import { connect } from 'react-redux';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { makeStyles, Card, Button, CircularProgress, Typography } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
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
        history.goBack();
    };

    const onJoinRoom = (e) => {
        setIsJoiningRoom(true);

        const onSuccess = () => {
            setIsJoiningRoom(false);
            showSuccess('Room Joined!');
            // TODO: navigate to the room page with code;
        }

        const onFailure = (err) => {
            setIsJoiningRoom(false);
            showError(err);
        }

        joinRoom(roomCode, onSuccess, onFailure);
    };

    return (
        <Card className='card center' >
            <div className='paper'>
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
    );
}

export default connect(null, { joinRoom, showSuccess, showError })(JoinRoom);