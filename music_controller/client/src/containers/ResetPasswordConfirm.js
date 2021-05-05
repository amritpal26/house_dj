import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Box, Card, Avatar, Typography } from '@material-ui/core';
import LoadingButton from '../components/LoadingButton';
import PageLoader from '../components/PageLoader';
import { resetPasswordConfirm } from '../actions/auth';
import { showError } from '../actions/alert';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import Configs from '../configs';

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
        minWidth: '360px',
        minHeight: '420px',
        padding: theme.spacing(2),
    },
    paper: {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: '#00b8d4'
    },
    formContainer: {
        display: 'contents',
    },
    form: {
        width: '100%',
        margin: 'auto',
    },
    confirmButton: {
        marginTop: theme.spacing(4)
    }
}));

const ResetPasswordConfirm = ({ match, isAuthenticated, resetPasswordConfirm, showError }) => {
    const classes = useStyles();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: '',
        ReNewPassword: ''
    });

    useEffect(() => {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            return value === formData.newPassword;
        });

        ValidatorForm.addValidationRule('isPassword', (value) => {
            // TODO: need to match password validator with the backend.
            return value.length >= Configs.constants.PASSWORD_MIN_LENGTH
        });

        return () => {
            ValidatorForm.removeValidationRule('isPassword');
            ValidatorForm.removeValidationRule('isPasswordMatch');
        }
    });

    const onChange = e => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
    
    const onSuccess = () => {
        console.log('password reset success');
        history.replace('/login');
    }

    const onFailure = (err) => {
        console.log('Failed setting password: ', err.data.token);
        showError('Something wrong happened. Try again');
        history.replace('/login')
    }

    const onSubmit = e => {
        e.preventDefault();

        const uid = match.params.uid;
        const token = match.params.token;

        setIsLoading(true);
        resetPasswordConfirm(uid, token, formData.newPassword, formData.ReNewPassword, onSuccess, onFailure);
    }

    if (isAuthenticated == null) {
        return (<PageLoader></PageLoader>);
    } else if (isAuthenticated) {
        return (<Redirect to='/' />);
    }

    return (
        <Box className={classes.box}>
            <Card className={classes.card} >
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h4'>
                        Reset Password
                    </Typography>
                    <div className={classes.formContainer}>
                        <ValidatorForm
                            instantValidate={false}
                            className={classes.form}
                            autoComplete='none'
                            onSubmit={onSubmit}>
                            <TextValidator
                                fullWidth
                                name='newPassword'
                                variant='outlined'
                                margin='normal'
                                label='Password'
                                type='password'
                                autoComplete='new-password'
                                onChange={onChange}
                                value={formData.newPassword}
                                validators={['required', 'isPassword']}
                                errorMessages={['This field is required', `Password should be atleast ${Configs.constants.PASSWORD_MIN_LENGTH} characters`]}
                            />
                            <TextValidator
                                fullWidth
                                name='ReNewPassword'
                                variant='outlined'
                                margin='normal'
                                label='Confirm Password'
                                type='password'
                                autoComplete='new-password'
                                onChange={onChange}
                                value={formData.ReNewPassword}
                                validators={['isPasswordMatch', 'required']}
                                errorMessages={['Password Mismatch', 'This field is required',]}
                            />
                            <LoadingButton
                                fullWidth
                                className={classes.confirmButton}
                                isLoading={isLoading}
                            >Submit
                            </LoadingButton>
                        </ValidatorForm>
                    </div>
                </div>
            </Card>
        </Box>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { resetPasswordConfirm, showError })(ResetPasswordConfirm);