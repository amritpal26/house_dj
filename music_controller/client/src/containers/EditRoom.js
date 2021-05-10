import React, { useState, useEffect } from 'react';
import Configs from "../configs";
import { useHistory, useLocation, matchPath } from 'react-router';
import { createRoom, getRoom, updateRoom } from '../actions/room';
import { showSuccess, showError } from '../actions/alert';
import { connect } from 'react-redux';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { makeStyles, Card, Button, CircularProgress, Typography, FormControl, Switch, FormControlLabel } from "@material-ui/core";


const DEFAULT_VOTES_TO_SKIP = Configs.constants.DEFAULT_VOTES_TO_SKIP;
const DEFAULT_GUEST_CAN_PAUSE = Configs.constants.DEFAULT_GUEST_CAN_PAUSE;

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
    votesLabel: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: theme.spacing(2)
    }
}));

const EditRoom = ({ getRoom, updateRoom, showSuccess, showError }) => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const [isEditRoom, setIsEditRoom] = useState(false);
    const [isSavingRoom, setIsSavingRoom] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        votesToSkip: DEFAULT_VOTES_TO_SKIP,
        guestCanPause: DEFAULT_GUEST_CAN_PAUSE
    });

    useEffect(() => {
        const onGetRoomSuccess = (room) => {
            setFormData({
                ...formData,
                code: room.code,
                title: room.title,
                votesToSkip: room.votes_to_skip,
                guestCanPause: room.guest_can_pause,
            })
        }

        const onGetRoomFailure = (err) => {
            showError(err);
            history.goBack();
        }

        const editMatch = matchPath(location.pathname, '/edit-room/:code');
        if (editMatch) {
            const code = editMatch.params.code;
            setIsEditRoom(true)
            getRoom(code, false, onGetRoomSuccess, onGetRoomFailure);
        }

        ValidatorForm.addValidationRule('isStrictPositive', (value) => {
            return value > 0;
        });

        return () => {
            ValidatorForm.removeValidationRule('isStrictPositive');
        }
    }, [location]);

    const onGuestCanPauseChange = (e) => setFormData({
        ...formData,
        guestCanPause: e.target.checked
    });

    const onChange = (e) => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });

    const onCancel = () => {
        history.goBack();
    };

    const onSaveRoom = (e) => {
        setIsSavingRoom(true);
        
        const onSuccess = (res) => {
            setIsSavingRoom(false);
            showSuccess(isEditRoom ? 'Room Updated' : 'Room Created');
        }

        const onFailure = (err) => {
            setIsSavingRoom(false);
            showError(err);
            history.goBack();
        }

        if (isEditRoom) {
            updateRoom(formData.code, formData.title, formData.votesToSkip, formData.guestCanPause, onSuccess, onFailure);
        } else {
            createRoom(formData.title, formData.votesToSkip, formData.guestCanPause, onSuccess, onFailure);
        }
    };

    return (
        <Card className='card center' >
            <div className='paper'>
                <Typography component='h1' variant='h4'>
                    Create A Room
                    </Typography>

                {isSavingRoom && <CircularProgress style={{ position: 'absolute', top: '50%', zIndex: 100 }} />}
                <ValidatorForm
                    className={classes.form}
                    onSubmit={onSaveRoom}>
                    <div className={classes.contentContainer}>
                        <TextValidator
                            fullWidth
                            label='Room name'
                            name='title'
                            disabled={isSavingRoom}
                            onChange={onChange}
                            value={formData.title}
                            validators={['required']}
                            errorMessages={['Name is required']}
                            style={{ width: '100%' }}
                        />
                        <TextValidator
                            type='number'
                            label='Votes to skip'
                            name='votesToSkip'
                            disabled={isSavingRoom}
                            value={formData.votesToSkip}
                            onChange={onChange}
                            helperText='Votes required to skip a song'
                            validators={['required', 'isStrictPositive']}
                            errorMessages={['This field is required', 'Votes to skip should be greater than 0']}
                            style={{ marginTop: '8px', width: '100%' }}
                        />
                        <FormControl component="fieldset">
                            <FormControlLabel
                                className={classes.votesLabel}
                                control={
                                    <Switch color="primary"
                                        defaultChecked={DEFAULT_GUEST_CAN_PAUSE}
                                        disabled={isSavingRoom}
                                        onChange={onGuestCanPauseChange}
                                    />}
                                label="Guest can pause/play music"
                                labelPlacement="start"
                            />
                        </FormControl>
                    </div>

                    <div className={classes.buttonsContainer}>
                        <Button
                            variant='outlined'
                            disabled={isSavingRoom}
                            onClick={onCancel}
                        >Cancel
                        </Button>
                        <Button
                            variant='outlined'
                            disabled={isSavingRoom}
                            type='submit'
                        >{isEditRoom ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </ValidatorForm>
            </div>
        </Card>
    );
}

const mapStateToProps = state => ({
    editRoom: state.room.editRoom
});

export default connect(mapStateToProps, { createRoom, getRoom, updateRoom, showSuccess, showError })(EditRoom);