import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { Card, Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import { updateProfile } from '../actions/auth';
import { showSuccess, showError } from '../actions/alert';

const useStyles = makeStyles(theme => ({
    form: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginTop: theme.spacing(1)
    },
    saveButton: {
        marginTop: theme.spacing(2)
    },
    formContent: {
        flexGrow: 1
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'space-evenly'
    }
}));

const UpdateProfile = ({ user, updateProfile, showSuccess, showError }) => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({...user});

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const onSuccess = (msg) => {
        setIsLoading(false);
        showSuccess(msg || 'Profile saved')
    };

    const onFailure = (err) => {
        setIsLoading(false);
        showError(err || 'Failed to save profile');
    }

    const onSubmit = () => {
        setIsLoading(true);
        updateProfile(formData.id, formData.first_name, formData.last_name, onSuccess, onFailure);
    };

    return (
        <Card className='card center' >
            <div className='paper'>
                <Typography component='h4' variant='h4'>
                    Profile
                </Typography>
                {isLoading && <CircularProgress className='circular-progress' />}
                <ValidatorForm
                    instantValidate={false}
                    className={classes.form}
                    autoComplete='none'
                    onSubmit={e => onSubmit(e)}>
                    <div className={ classes.formContent }>
                        <TextField
                            fullWidth
                            variant='outlined'
                            label='Email Address'
                            margin='normal'
                            disabled={isLoading}
                            inputProps = {{ readOnly: true }}
                            value={formData.email}/>
                        <TextValidator
                            fullWidth
                            autoFocus
                            name='first_name'
                            variant='outlined'
                            label='First Name'
                            margin='normal'
                            autoComplete='none'
                            onChange={onChange}
                            disabled={isLoading}
                            value={formData.first_name}
                            validators={['required']}
                            errorMessages={['This field is required']}/>
                        <TextValidator
                            fullWidth
                            name='last_name'
                            variant='outlined'
                            label='Last Name'
                            margin='normal'
                            autoComplete='none'
                            onChange={onChange}
                            disabled={isLoading}
                            value={formData.last_name}
                            validators={['required']}
                            errorMessages={['This field is required']}
                        />
                    </div>
                    <div className={classes.buttonsContainer}>
                        <Button
                            variant='outlined'
                            disabled={isLoading}
                            type='submit'
                        >Save
                        </Button>
                    </div>
                </ValidatorForm>
            </div>
        </Card>
    );
};

const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(mapStateToProps, { updateProfile, showSuccess, showError})(UpdateProfile);