import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import { AccountCircle as AccountCircleIcon }  from "@material-ui/icons";
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
    const history = useHistory();

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const openMenu = Boolean(menuAnchorEl);
    
    
    const updateProfile = () => {
        setMenuAnchorEl(null);
        history.replace('/update-profile');
    };

    const logoutUser = () => {
        setMenuAnchorEl(null);
        logout(() => { 
            history.replace('/login');
        });
    };

    const guestLinks = () => (
        <Fragment>
            <IconButton 
            size="small" 
            className={ `${classes.linkButton} ${classes.spacedIcon}` } 
            onClick={() => history.replace('/login')}
            >Login
            </IconButton>
            <IconButton 
                size="small" 
                className={classes.linkButton} 
                onClick={() => history.replace('/signup')}
            >Sign Up
            </IconButton>
        </Fragment >
    );

    const authorizedLinks = () => (
        <Fragment>
            <IconButton 
                size="small" 
                className={ `${classes.linkButton} ${classes.spacedIcon}` }
                onClick={() => history.replace('/')}
            >Rooms
            </IconButton>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                className={classes.linkButton}
                onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                <AccountCircleIcon />
            </IconButton>
            <Menu
                id="menu-appbar"
                keepMounted
                anchorEl={menuAnchorEl}
                open={openMenu}
                onClose={() => setMenuAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={updateProfile}>Profile</MenuItem>
                <MenuItem onClick={logoutUser}>Logout</MenuItem>
            </Menu>
        </Fragment>
    );

    return (
        <Fragment>
            <AppBar position="relative">
                <Toolbar variant="dense">
                    <Typography component='h5' variant="h5" color="inherit" className={classes.title}>
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