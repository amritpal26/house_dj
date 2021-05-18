import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { Card, Typography } from "@material-ui/core";
import { activate } from '../actions/auth';
import { showSuccess, showError } from '../actions/alert';
import LoadingButton from '../components/LoadingButton';

const useStyles = makeStyles(theme => ({
    verifyButton: {
        marginTop: theme.spacing(8)
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flexGrow: 1,
    },
}));

const Activate = ({ verify, showSuccess, showError, match }) => {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const classes = useStyles();

    const onSuccess = () => {
        showSuccess('Account Verified');
        setIsVerified(true);
        setIsLoading(false);
    };

    const onFailure = (err) => {
        // TODO: show error message on Failure.
        showError(err);
        setIsVerified(false);
        setIsLoading(false);
    };

    const verifyAccount = (_) => {
        setIsLoading(true);
        const uid = match.params.uid;
        const token = match.params.token;

        verify(uid, token, onSuccess, onFailure);
    }

    if (isVerified) {
        return (<Redirect to="/login" />);
    }

    return (
        <Card className='card center' >
            <div className='paper'>

                <Typography component='h4' variant='h4'>
                    Welcome
                </Typography>

                <div className={classes.contentContainer}>
                    <Typography component='p' variant='h6'>
                        Click on verify to activate your account
                    </Typography>

                    <LoadingButton
                        className={classes.verifyButton}
                        onClick={verifyAccount}
                        isLoading={isLoading}
                    >Verify
                    </LoadingButton>

                </div>
            </div>
        </Card>
    );
};

export default connect(null, { verify: activate, showSuccess, showError })(Activate);