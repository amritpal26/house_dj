import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Card, Avatar, Typography, Box } from '@material-ui/core';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import TextLine from '../components/TextLine';
import LoadingButton from '../components/LoadingButton';
import PageLoader from '../components/PageLoader';
import Configs from '../configs';
import theme from '../theme';
import { signup } from '../actions/auth';

const useStyles = makeStyles(theme => ({
    box: {
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        padding: theme.spacing(2),
        minWidth: '360px'
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifySelf: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: '#00b8d4'
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1)
    },
    registerButton: {
        marginTop: theme.spacing(2)
    },
    links: {
        textAlign: 'center',
        marginTop: theme.spacing(2)
    }
}));

const Signup = ({ signUp, isAuthenticated }) => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [accountCreated, setAccountCreated] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== formData.password) {
                return false;
            }
            return true;
        });

        ValidatorForm.addValidationRule('isPassword', (value) => {
            // TODO: need to match password validator with the backend.
            if (value.length < Configs.constants.PASSWORD_MIN_LENGTH) {
                return false;
            }
            return true;
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

    const onSignupSuccess = () => {
        setIsLoading(false);
        setAccountCreated(true);
    };

    const onSignupFailure = () => {
        // TODO: show error message here.
        setIsLoading(false);
    };

    const onSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        signUp(formData.firstName, formData.lastName, formData.email, formData.password, formData.confirmPassword, onSignupSuccess, onSignupFailure);
    };

    if (isAuthenticated == null) {
        return (<PageLoader></PageLoader>);
    } else if (isAuthenticated) {
        return (<Redirect to='/' />);
    } else if (accountCreated) {
        return (<Redirect to='/login' />);
    }

    return (
        <Box className={classes.box}>
            <Card className={classes.card} >
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h4'>
                        Sign Up
                            </Typography>
                    <ValidatorForm
                        instantValidate={false}
                        className={classes.form}
                        autoComplete='none'
                        onSubmit={e => onSubmit(e)}>
                        <TextValidator
                            fullWidth
                            autoFocus
                            name='firstName'
                            variant='outlined'
                            label='First Name'
                            margin='normal'
                            autoComplete='none'
                            onChange={onChange}
                            value={formData.firstName}
                            validators={['required']}
                            errorMessages={['This field is required']}
                        />
                        <TextValidator
                            fullWidth
                            name='lastName'
                            variant='outlined'
                            label='Last Name'
                            margin='normal'
                            autoComplete='none'
                            onChange={onChange}
                            value={formData.lastName}
                            validators={['required']}
                            errorMessages={['This field is required']}
                        />
                        <TextValidator
                            fullWidth
                            name='email'
                            variant='outlined'
                            label='Email Address'
                            margin='normal'
                            autoComplete='none'
                            onChange={onChange}
                            value={formData.email}
                            validators={['required', 'isEmail']}
                            errorMessages={['This field is required', 'Email is not valid']}
                        />
                        <TextValidator
                            fullWidth
                            name='password'
                            variant='outlined'
                            margin='normal'
                            label='Password'
                            type='password'
                            autoComplete='new-password'
                            onChange={onChange}
                            value={formData.password}
                            validators={['required', 'isPassword']}
                            errorMessages={['This field is required', `Password should be atleast ${Configs.constants.PASSWORD_MIN_LENGTH} characters`]}
                        />
                        <TextValidator
                            fullWidth
                            name='confirmPassword'
                            variant='outlined'
                            margin='normal'
                            label='Confirm Password'
                            type='password'
                            autoComplete='new-password'
                            onChange={onChange}
                            value={formData.confirmPassword}
                            validators={['isPasswordMatch', 'required']}
                            errorMessages={['Password Mismatch', 'This field is required',]}
                        />
                        <LoadingButton
                            fullWidth
                            className={classes.registerButton}
                            isLoading={isLoading}
                            onClick={onSubmit}
                        >Register
                                </LoadingButton>
                    </ValidatorForm>
                    <TextLine text='OR' marginTop={theme.spacing(2)} />
                    <div className={classes.links}>
                        <Typography component='h1' variant='body2'>
                            Already have an account? <Link to='/login'>Sign In</Link>
                        </Typography>
                    </div>
                </div>
            </Card>
        </Box>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { signUp: signup })(Signup);