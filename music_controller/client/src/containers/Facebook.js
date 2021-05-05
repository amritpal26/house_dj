import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useLocation } from 'react-router';
import { facebookAuthenticate } from '../actions/auth';
import { showError } from '../actions/alert';
import PageLoader from '../components/PageLoader';
import queryString from 'query-string';

const Facebook = ({ facebookAuthenticate, showError }) => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authFailed, setAuthFailed] = useState(false);

    const onAuthSuccess = () => {
        setIsAuthenticated(true);
    };

    const onAuthFailure = (err) => {
        showError('Something wrong happened. Try again');
        setAuthFailed(true);
    };

    useEffect(() => {
        const values = queryString.parse(location.search);
        const state = values.state ? values.state : null;
        const code = values.code ? values.code : null;


        if (state && code) {
            facebookAuthenticate(state, code, onAuthSuccess, onAuthFailure);
        }
    }, [location]);

    if (authFailed) {
        return <Redirect to="/login"></Redirect>
    } else if (isAuthenticated) {
        return <Redirect to="/"></Redirect>
    }

    return (
        <PageLoader></PageLoader>
    );
};

export default connect(null, { facebookAuthenticate, showError })(Facebook);