import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Box, Card, Avatar, Typography } from '@material-ui/core';
import LoadingButton from '../components/LoadingButton';
import PageLoader from '../components/PageLoader';
import { resetPassword } from '../actions/auth';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

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
        marginTop: '50px',
        width: '360px',
        textAlign: 'center'
    },
    form: {
        width: '100%',
        margin: 'auto',
    },
    confirmButton: {
        marginTop: theme.spacing(4)
    }
}));

const ResetPassword = ({ isAuthenticated, resetPassword }) => {
    const classes = useStyles();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false)
    const [emailConfirmed, setEmailConfirmed] = useState(false);
    const [email, setEmail] = useState('');

    const onEmailChange = e => setEmail(e.target.value);
    
    const onSuccess = () => {
        setEmailConfirmed(true);
    }

    const onFailure = (err) => {
        // TODO: show error message and do not navigate to login.
        history.replace('/login')
    }

    const onSubmit = e => {
        e.preventDefault();

        setIsLoading(true);
        resetPassword(email, onSuccess, onFailure);
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

                    {emailConfirmed && <div className={classes.formContainer}>
                        <Typography component='p' variant='h6'>
                            Email Confirmed
                        </Typography>
                        <Typography component='p' variant='body1'>
                            Please check your email to for a link to confirm password.
                        </Typography>
                    </div>}

                    {!emailConfirmed && <div className={classes.formContainer}>
                        <ValidatorForm
                            instantValidate={false}
                            className={classes.form}
                            autoComplete='none'
                            onSubmit={onSubmit}>
                            <TextValidator
                                fullWidth
                                name='email'
                                variant='outlined'
                                label='Email Address'
                                margin='normal'
                                autoComplete='none'
                                onChange={onEmailChange}
                                value={email}
                                validators={['required', 'isEmail']}
                                errorMessages={['This field is required', 'Email is not valid']}
                            />
                            <LoadingButton
                                fullWidth
                                className={classes.confirmButton}
                                isLoading={isLoading}
                            >Confirm
                            </LoadingButton>
                        </ValidatorForm>
                    </div>}
                </div>
            </Card>
        </Box>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { resetPassword })(ResetPassword);