import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Card, Container, Avatar, TextField, Button, Typography, Box, FormControl } from "@material-ui/core";
import { login } from '../actions/auth';
import TextLine from '../components/TextLine';
import PageLoader from '../components/PageLoader';
import axios from 'axios';
import theme, { Colors } from '../theme';

const useStyles = makeStyles(theme => ({
    box: {
        display: "flex",
        minHeight: "100vh",
        alignItems: "center"
    },
    card: {
        padding: theme.spacing(2)
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifySelf: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "#00b8d4"
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1)
    },
    signinButton: {
        marginTop: theme.spacing(2)
    },
    socialLoginButton: {
        marginTop: theme.spacing(2),
        color: theme.palette.getContrastText(Colors.FACEBOOK_BTN),
        background: Colors.FACEBOOK_BTN,
    },
    links: {
        marginTop: theme.spacing(2),
        textAlign: "center"
    }
}));

const Login = ({ login, isAuthenticated }) => {

    if (isAuthenticated == null) {
        return (<PageLoader></PageLoader>);
    } else if (isAuthenticated) {
        return (<Redirect to="/" />);
    }

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();

        login(email, password);
    };

    const continueWithGoogle = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=${process.env.REACT_APP_API_URL}/google`);
            window.location.replace(res.data.authorization_url);
        } catch (err) {
            
        }
    };

    const continueWithFacebook = async () => {
        console.log('continue with facebook');
        // try {
        //     const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/facebook/?redirect_uri=${process.env.REACT_APP_API_URL}/facebook`)

        //     window.location.replace(res.data.authorization_url);
        // } catch (err) {

        // }
    };

    if (isAuthenticated) {
        return <Redirect to='/' />
    }

    const classes = useStyles();
    return (
        <div>
            <Box className={classes.box}>
                <Container component="main" maxWidth="xs" >
                    <Card className={classes.card} >
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h4">
                                Sign in
                            </Typography>
                            <form className={classes.form} noValidate autoComplete="none" onSubmit={e => onSubmit(e)}>
                                <TextField
                                    required
                                    fullWidth
                                    autoFocus
                                    variant="outlined"
                                    label="Email Address"
                                    margin="normal"
                                    autoComplete="none"
                                />
                                <TextField
                                    required
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    label="Password"
                                    type="password"
                                    autoComplete="new-password"
                                />
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    className={classes.signinButton}
                                    color="primary"
                                >Sign In</Button>
                            </form>
                            <TextLine text="OR" marginTop={theme.spacing(2)}/>
                            <FormControl fullWidth >
                                <Button
                                    fullWidth
                                    variant="contained"
                                    className={classes.socialLoginButton}
                                    onClick={continueWithGoogle}
                                    >Sign in with google</Button>
                                 <Button
                                    fullWidth
                                    variant="contained"
                                    className={classes.socialLoginButton}
                                    onClick={continueWithFacebook}
                                    >Sign in with Facebook</Button>
                            </FormControl>
                            <div className={classes.links}>
                                <Typography component="h1" variant="body2">
                                    Don't have an account? <Link to='/signup'>Sign Up</Link>
                                </Typography>
                                <Typography component="h1" variant="body2">
                                    Forgot your Password? <Link to='/reset-password'>Reset Password</Link>
                                </Typography>
                            </div>
                        </div>
                    </Card>
                </Container>
            </Box>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);