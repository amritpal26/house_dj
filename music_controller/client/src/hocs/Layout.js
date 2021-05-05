import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useHistory, matchPath } from 'react-router-dom';
import { connect } from 'react-redux';
import { Snackbar, makeStyles } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { checkAuthenticated, loadUser } from '../actions/auth';
import { hideError, showError } from '../actions/alert';
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
    }
}));

function Alert(props) {
    return <MuiAlert
        elevation={6} 
        variant="filled" 
        style={{ minWidth: '360px' }}
        {...props} 
    />;
}

const Layout = ({ error, checkAuthenticated, loadUser, hideError, showError, children }) => {
    const classes = useStyles();
    let location = useLocation();
    let history = useHistory();

    const handleClose = () => {
        hideError();
    }

    const authCheckSuccess = () => {
        loadUser(null, () => {
            // TODO: print message.
            history.replace('/login');
        });
    }

    const authCheckFailed = (err) => {
        showError('auth Failed mitra!');
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

    return (
        <div className={classes.container}>
            <Navbar />
            <Snackbar open={errorSnack} autoHideDuration={6000} onClose={handleClose}>
                <Alert className={classes.alert} onClose={handleClose} severity='error'>
                    {error}
                </Alert>
            </Snackbar>
            <div style={{ flex: '1' }}>
                {children}
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    error: state.alert.errorMessage
});

export default connect(mapStateToProps, { checkAuthenticated, loadUser, hideError, showError })(Layout);