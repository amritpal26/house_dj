import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { checkAuthenticated, loadUser, googleAuthenticate } from '../actions/auth';

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

    useEffect(() => {
        if (!noAuthPathnames.includes(location.pathname)) {
            checkAuthenticated();
            loadUser();
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

export default connect(null, { checkAuthenticated, loadUser, googleAuthenticate })(Layout);