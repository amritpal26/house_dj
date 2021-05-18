import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Card, Avatar, Typography } from '@material-ui/core';
import LoadingButton from '../components/LoadingButton';
import PageLoader from '../components/PageLoader';
import { resetPassword } from '../actions/auth';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { Redirect } from 'react-router';

const useStyles = makeStyles((theme) => ({
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: '#00b8d4'
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        height: '100%',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        width: '100%',
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
    emailConfirmedMessage: {
        textAlign: 'center',
    }
}));

const ResetPassword = ({ isAuthenticated, resetPassword }) => {
    const classes = useStyles();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false)
    const [emailConfirmed, setEmailConfirmed] = useState(true);
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
        <Card className='card center' >
            <div className='paper'>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h4' variant='h4'>
                    Reset Password
                    </Typography>

                {emailConfirmed && <div className={classes.contentContainer}>
                    <Typography component='h6' variant='h6'>
                        Email Confirmed
                        </Typography>
                    <Typography component='p' variant='body1' className={classes.emailConfirmedMessage}>
                        Please check your email to for a link to confirm password.
                    </Typography>
                </div>}

                {!emailConfirmed && <ValidatorForm
                    instantValidate={false}
                    className={classes.contentContainer}
                    autoComplete='none'
                    onSubmit={onSubmit}>
                    <div className={classes.form}>
                        <TextValidator
                            fullWidth
                            name='email'
                            variant='outlined'
                            label='Email Address'
                            margin='normal'
                            autoComplete='none'
                            onChange={onEmailChange}
                            value={email}
                            disabled={isLoading}
                            validators={['required', 'isEmail']}
                            errorMessages={['This field is required', 'Email is not valid']}
                        />
                    </div>
                    <div className={classes.buttonsContainer}>
                        <LoadingButton
                            fullWidth
                            isLoading={isLoading}
                        >Confirm
                            </LoadingButton>
                    </div>
                </ValidatorForm>}
            </div>
        </Card>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { resetPassword })(ResetPassword);