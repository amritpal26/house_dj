import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useHistory, matchPath } from 'react-router-dom';
import { connect } from 'react-redux';
import { Snackbar, makeStyles } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { checkAuthenticated, loadUser } from '../actions/auth';
import { hideError, hideSuccess, showError } from '../actions/alert';
import Configs from '../configs';

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    alert: {
        minWidth: '360px',
        maxWidth: '720px'
    },
    muiAlert: {
        minWidth: '360px'
    },
    appContainer: {
        flex: 1,
    }
}));

function Alert(props) {
    return <MuiAlert
        elevation={6} 
        variant="filled"
        className={classes.muiAlert}
        {...props} 
    />;
}

const Layout = ({ error, success, checkAuthenticated, loadUser, hideError, hideSuccess, showError, children }) => {
    const classes = useStyles();
    let location = useLocation();
    let history = useHistory();

    const handleClose = (type) => {
        if (type == 'error') {
            hideError();
        } else {
            hideSuccess();
        }
    }

    const authCheckSuccess = () => {
        loadUser(null, () => {
            showError('Failed to load data from server. Try again.')
            history.replace('/login');
        });
    }

    const authCheckFailed = (err) => {
        history.replace('/login');
    }

    useEffect(() => {
        const currentPath = location.pathname;
        const matchingNoAuthPaths = Configs.NoAuthPaths.filter((path) => {
            return matchPath(currentPath, path) !== null
        });

        if (matchingNoAuthPaths.length == 0) {
            checkAuthenticated(authCheckSuccess, authCheckFailed);
        } else {
            checkAuthenticated(null, null);
        }
    }, [location]);

    const errorSnack = (typeof error === 'string' && error.length > 0);
    const successSnack = (typeof success === 'string' && success.length > 0);

    return (
        <div className={classes.container}>
            <Navbar />
            <Snackbar open={errorSnack} autoHideDuration={6000} onClose={() => handleClose('error')}>
                <Alert className={classes.alert} onClose={() => handleClose('error')} severity='error'>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={successSnack} autoHideDuration={4000} onClose={() => handleClose('success')}>
                <Alert className={classes.alert} onClose={() => handleClose('success')} severity='success'>
                    {success}
                </Alert>
            </Snackbar>
            <div className={classes.appContainer}>
                {children}
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    error: state.alert.errorMessage,
    success: state.alert.successMessage
});

export default connect(mapStateToProps, { checkAuthenticated, loadUser, hideError, hideSuccess, showError })(Layout);