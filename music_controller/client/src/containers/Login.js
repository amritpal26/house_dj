import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Card, Avatar, TextField, Button, Typography, Box, FormControl } from '@material-ui/core';
import { login } from '../actions/auth';
import TextLine from '../components/TextLine';
import LoadingButton from '../components/LoadingButton';
import PageLoader from '../components/PageLoader';
import axios from 'axios';
import theme, { Colors } from '../theme';

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

const Login = ({ login, isAuthenticated }) => {
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

    const onLoginFailure = () => {
        // TODO: handle login failure and show error message.
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
            // TODO: handle the error here.
        }
    };

    const continueWithFacebook = async () => {
        console.log('continue with facebook');
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/facebook/?redirect_uri=${process.env.REACT_APP_API_URL}/facebook`)

            window.location.replace(res.data.authorization_url);
        } catch (err) {
            // TODO: handle the error here.
        }
    };

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
                        Sign in
                            </Typography>
                    <form className={classes.form} noValidate autoComplete='none' onSubmit={e => onSubmit(e)}>
                        <TextField
                            required
                            fullWidth
                            autoFocus
                            name='email'
                            variant='outlined'
                            label='Email Address'
                            margin='normal'
                            autoComplete='none'
                            onChange={onChange}
                        />
                        <TextField
                            required
                            fullWidth
                            name='password'
                            variant='outlined'
                            margin='normal'
                            label='Password'
                            type='password'
                            autoComplete='new-password'
                            onChange={onChange}
                        />
                        <LoadingButton
                            fullWidth
                            className={classes.signInButton}
                            isLoading={isLoading}
                            onClick={onSubmit}
                        >Sign In
                                </LoadingButton>
                    </form>
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
                        <Typography component='h1' variant='body2'>
                            Don't have an account? <Link to='/signup'>Sign Up</Link>
                        </Typography>
                        <Typography component='h1' variant='body2'>
                            Forgot your Password? <Link to='/reset-password'>Reset Password</Link>
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

export default connect(mapStateToProps, { login })(Login);