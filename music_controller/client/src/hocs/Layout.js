import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkAuthenticated, loadUser, googleAuthenticate } from '../actions/auth';

const noAuthPathnames = ['/google', '/facebook', '/login', '/signup'];

const Layout = ({ checkAuthenticated, loadUser, children }) => {
    let location = useLocation();

    useEffect(() => {
        if (!noAuthPathnames.includes(location.pathname)) {
            checkAuthenticated();
            loadUser();
        }
    }, [location]);

    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
};

export default connect(null, { checkAuthenticated, loadUser, googleAuthenticate })(Layout);