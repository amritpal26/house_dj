import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { Box, Card, Typography } from "@material-ui/core";
import { activate } from '../actions/auth';
import LoadingButton from '../components/LoadingButton';

const useStyles = makeStyles(theme => ({
    box: {
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center"
    },
    card: {
        minHeight: "400px",
        minWidth: "300px",
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(2),
        alignItems: "center",
        justifyContent: "center"
    },
    verifyButton : {
        marginTop: theme.spacing(4)
    },
}));

const Activate = ({ verify, match }) => {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const classes = useStyles();

    if (isVerified) {
        return (<Redirect to="/"/>);
    }

    const onSuccess = () => {
        setIsVerified(true);
        setIsLoading(false);
    };

    const onFailure = () => {
        // TODO: show error message on Failure.
        setIsVerified(false);
        setIsLoading(false);
    };

    const verifyAccount = (_) => {
        setIsLoading(true);
        const uid = match.params.uid;
        const token = match.params.token;

        verify(uid, token, onSuccess, onFailure);
    }

    return (
        <Box className={classes.box}>
            <Card className={classes.card} >
                <Typography component="h1" variant="h4">
                    Click on verify to activate your account
                </Typography>
                <LoadingButton
                    className={classes.verifyButton}
                    onClick={verifyAccount}
                    isLoading={isLoading}
                >
                    Verify
                </LoadingButton>
            </Card>
        </Box>
    );
};


export default connect(null, { verify: activate })(Activate);