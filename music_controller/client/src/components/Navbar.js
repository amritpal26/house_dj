import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';

import { logout } from '../actions/auth';
import Configs from '../configs';
import { Colors } from '../theme';


const useStyles = makeStyles((theme) => ({
    link: {
        textDecoration: 'none'
    },
    linkButton: {
        color: Colors.NAVBAR_LINKS_TEXT
    },
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

const Navbar = ({ isAuthenticated, logout }) => {
    const classes = useStyles();

    const logoutUser = () => {
        logout();
    };

    const guestLinks = () => (
        <Fragment>
            <NavLink className={classes.link} to='/login'>
                <IconButton size="small" className={`${classes.linkButton} ${classes.spacedIcon}`}>
                    Login
                </IconButton>
            </NavLink>
            <NavLink className={classes.link} to='/signup'>
                <IconButton size="small" className={classes.linkButton}>
                    Sign Up
                </IconButton>
            </NavLink>
        </Fragment >
    );

    const authorizedLinks = () => (
        <Fragment>
            <IconButton size="small" className={classes.linkButton} onClick={logoutUser}>
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
        </Fragment>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(Navbar);