import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';

import { logout } from '../actions/auth';
import Configs from '../configs';


const useStyles = makeStyles((theme) => ({
    spacedIcon: {
        marginRight: theme.spacing(1),
    },
    title: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    }
}));

const Navbar = ({ logout, isAuthenticated }) => {
    const [redirect, setRedirect] = useState(null);

    const logout_user = () => {
        logout();
        setRedirect('/');
    };

    const classes = useStyles();

    const guestLinks = () => (
        <Fragment>
            <IconButton size="small" color="inherit" className={classes.spacedIcon} onClick={() => setRedirect('login')}>
                Login
            </IconButton>
            <IconButton size="small" color="inherit" onClick={() => setRedirect('/signup')}>
                Sign Up
            </IconButton>
        </Fragment >
    );

    const authorizedLinks = () => (
        <Fragment>
            <IconButton size="small" color="inherit" onClick={logout_user}>
                Logout
            </IconButton>
        </Fragment >
    );

    return (
        <Fragment>
            <AppBar >
                <Toolbar variant="dense">
                    <Typography variant="h5" color="inherit" className={classes.title}>
                        {Configs.constants.APP_NAME}
                    </Typography>
                    {isAuthenticated ? authorizedLinks() : guestLinks()}
                </Toolbar>
            </AppBar>
            {redirect ? <Redirect to={redirect} /> : <Fragment></Fragment>}
        </Fragment>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(Navbar);