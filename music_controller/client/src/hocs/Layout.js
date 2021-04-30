import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkAuthenticated, loadUser, googleAuthenticate } from '../actions/auth';
import queryString from 'query-string';

const Layout = ({ checkAuthenticated, loadUser, googleAuthenticate, children }) => {
    
    let location = useLocation();

    useEffect(() => {
        const values = queryString.parse(location.search);
        const state = values.state ? values.state : null;
        const code = values.code ? values.code : null;

        if (state && code) {
            googleAuthenticate(state, code);
        } else {
            checkAuthenticated();
            loadUser();
        }
    }, []);

    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
};

export default connect(null, { checkAuthenticated, loadUser, googleAuthenticate })(Layout);