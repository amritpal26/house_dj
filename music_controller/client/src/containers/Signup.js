import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Card, Container, Avatar, Button, Typography, Box } from "@material-ui/core";
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import TextLine from '../components/TextLine';
import Configs from "../configs";

import { login } from '../actions/auth';
import theme from '../theme';

const useStyles = makeStyles(theme => ({
    box: {
        display: "flex",
        minHeight: "100vh",
        alignItems: "center"
    },
    card: {
        padding: theme.spacing(2),
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
    registerButton: {
        marginTop: theme.spacing(2)
    },
    links: {
        textAlign: "center",
        marginTop: theme.spacing(2)
    }
}));

const Signup = ({ login, isAuthenticated }) => {

    if (isAuthenticated) {
        return <Redirect to='/' />
    }

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const onChange = e => setFormData({ 
        ...formData, 
        [e.target.name]: e.target.value 
    });

    useEffect(() => {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== formData.password) {
                return false;
            }
            return true;
        });

        ValidatorForm.addValidationRule('isPassword', (value) => {
            if (value.length < Configs.constants.PASSWORD_MIN_LENGTH) {
                return false;
            }
            return true;
        });

        return () => {
            ValidatorForm.removeValidationRule('isPasswordMatch');
        }
    });


    const onSubmit = async (e) => {
        e.preventDefault();

        login(formData.email, password);
    };

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
                                Sign Up
                            </Typography>
                            <ValidatorForm
                                instantValidate={false}
                                className={classes.form} 
                                autoComplete="none" 
                                onSubmit={e => onSubmit(e)}>
                                <TextValidator
                                    fullWidth
                                    autoFocus
                                    name="firstName"
                                    variant="outlined"
                                    label="First Name"
                                    margin="normal"
                                    autoComplete="none"
                                    onChange={ onChange }
                                    value={ formData.firstName }
                                    validators={['required']}
                                    errorMessages={['This field is required']}
                                />
                                <TextValidator
                                    fullWidth
                                    name="lastName"
                                    variant="outlined"
                                    label="Last Name"
                                    margin="normal"
                                    autoComplete="none"
                                    onChange={ onChange }
                                    value={ formData.lastName }
                                    validators={['required']}
                                    errorMessages={['This field is required']}
                                />
                                <TextValidator
                                    fullWidth
                                    name="email"
                                    variant="outlined"
                                    label="Email Address"
                                    margin="normal"
                                    autoComplete="none"
                                    onChange={ onChange }
                                    value={ formData.email }
                                    validators={['required', 'isEmail']}
                                    errorMessages={['This field is required', 'Email is not valid']}
                                />
                                <TextValidator
                                    fullWidth
                                    name="password"
                                    variant="outlined"
                                    margin="normal"
                                    label="Password"
                                    type="password"
                                    autoComplete="new-password"
                                    onChange={ onChange }
                                    value={ formData.password }
                                    validators={['required', 'isPassword']}
                                    errorMessages={['This field is required', `Password should be atleast ${Configs.constants.PASSWORD_MIN_LENGTH} characters`]}
                                />
                                <TextValidator
                                    fullWidth
                                    name="confirmPassword"
                                    variant="outlined"
                                    margin="normal"
                                    label="Confirm Password"
                                    type="password"
                                    autoComplete="new-password"
                                    onChange={ onChange }
                                    value={ formData.confirmPassword }
                                    validators={['isPasswordMatch', 'required']}
                                    errorMessages={['Password Mismatch', 'This field is required', ]}
                                />
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    className={classes.registerButton}
                                    color="primary"
                                >Register</Button>
                            </ValidatorForm>
                            <TextLine text="OR" marginTop={theme.spacing(2)}/>
                            <div className={classes.links}>
                                <Typography component="h1" variant="body2">
                                    Already have an account? <Link to='/login'>Sign In</Link>
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

export default connect(mapStateToProps, { login })(Signup);