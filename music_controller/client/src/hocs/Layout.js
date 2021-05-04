import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { checkAuthenticated, loadUser } from '../actions/auth';

const useStyles = makeStyles(() => ({
    container: { 
        display: 'flex',
        flexDirection: 'column', 
        height: '100%' 
    }
}));

const noAuthPathnames = ['/google', '/facebook', '/login', '/signup'];

const Layout = ({ checkAuthenticated, loadUser, children }) => {
    const classes = useStyles();
    let location = useLocation();
    let history = useHistory();

    const authCheckSuccess = () => {
        loadUser(null, () => {
            // TODO: print message.
            history.replace('/login');
        });
    }
    const authCheckFailed = (err) => {
        // TODO: print message.
        console.log('auth check has failed');
        history.replace('/login');
    }

    useEffect(() => {
        if (!noAuthPathnames.includes(location.pathname)) {
            checkAuthenticated(authCheckSuccess, authCheckFailed);
        }
    }, [location]);

    return (
        <div className={classes.container}>
            <Navbar />
            <div style={{ flex: '1' }}>
                {children}
            </div>
        </div>
    );
};

export default connect(null, { checkAuthenticated, loadUser })(Layout);