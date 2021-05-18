import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Card, Avatar, Button, Typography, FormControl } from '@material-ui/core';
import { login } from '../actions/auth';
import { showError } from '../actions/alert';
import TextLine from '../components/TextLine';
import LoadingButton from '../components/LoadingButton';
import PageLoader from '../components/PageLoader';
import axios from 'axios';
import theme, { Colors } from '../theme';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';


const useStyles = makeStyles(theme => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(1)
    },
    signInButton: {
        marginTop: theme.spacing(2)
    },
    socialLoginButton: {
        marginTop: theme.spacing(2),
        color: theme.palette.getContrastText(Colors.FACEBOOK_BTN),
        background: Colors.FACEBOOK_BTN,
    },
    links: {
        marginTop: theme.spacing(2),
        textAlign: 'center'
    }
}));

const Login = ({ login, isAuthenticated, showError }) => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const onChange = e => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });

    const onLoginSuccess = () => {
        setIsLoading(false);
    };

    const onLoginFailure = (err) => {
        const errMsg = typeof err == 'string' ? err : 'Failed to login';
        showError(errMsg);
        setIsLoading(false);
    };

    const onSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        login(formData.email, formData.password, onLoginSuccess, onLoginFailure);
    };

    const continueWithGoogle = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=${process.env.REACT_APP_API_URL}/google`);
            window.location.replace(res.data.authorization_url);
        } catch (err) {
            showError(err);
        }
    };

    const continueWithFacebook = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/facebook/?redirect_uri=${process.env.REACT_APP_API_URL}/facebook`)
            window.location.replace(res.data.authorization_url);
        } catch (err) {
            showError(err);
        }
    };

    if (isAuthenticated == null) {
        return (<PageLoader></PageLoader>);
    } else if (isAuthenticated) {
        return (<Redirect to='/' />);
    }

    return (
        <Card className='card center' >
            <div className='paper'>
                <Avatar className='card-avatar'>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h4' variant='h4'>
                    Sign in
                    </Typography>
                <ValidatorForm 
                    className={classes.form} 
                    instantValidate={false}
                    autoComplete='none' 
                    onSubmit={onSubmit}
                >
                    <TextValidator
                        fullWidth
                        autoFocus
                        name='email'
                        variant='outlined'
                        label='Email Address'
                        margin='normal'
                        autoComplete='none'
                        validators={['required', 'isEmail']}
                        value={formData.email}
                        errorMessages={['This field is required', 'Email is not valid']}
                        onChange={onChange}
                    />
                    <TextValidator
                        fullWidth
                        name='password'
                        variant='outlined'
                        margin='normal'
                        label='Password'
                        type='password'
                        autoComplete='new-password'
                        validators={['required']}
                        value={formData.password}
                        errorMessages={['This field is required']}
                        onChange={onChange}
                    />
                    <LoadingButton
                        fullWidth
                        className={classes.signInButton}
                        isLoading={isLoading}
                    >Sign In
                        </LoadingButton>
                </ValidatorForm>
                <TextLine text='OR' marginTop={theme.spacing(2)} />
                <FormControl fullWidth >
                    <Button
                        fullWidth
                        variant='contained'
                        className={classes.socialLoginButton}
                        onClick={continueWithGoogle}
                    >Sign in with google</Button>
                    <Button
                        fullWidth
                        variant='contained'
                        className={classes.socialLoginButton}
                        onClick={continueWithFacebook}
                    >Sign in with Facebook</Button>
                </FormControl>
                <div className={classes.links}>
                    <Typography component='p' variant='body2'>
                        Don't have an account? <Link to='/signup'>Sign Up</Link>
                    </Typography>
                    <Typography component='p' variant='body2'>
                        Forgot your Password? <Link to='/reset-password'>Reset Password</Link>
                    </Typography>
                </div>
            </div>
        </Card>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login, showError })(Login);