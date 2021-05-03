import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useLocation } from 'react-router';
import { googleAuthenticate } from '../actions/auth';
import PageLoader from '../components/PageLoader';
import queryString from 'query-string';

const Google = ({ googleAuthenticate }) => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authFailed, setAuthFailed] = useState(false);

    const onAuthSuccess = () => {
        setIsAuthenticated(true);
    };

    const onAuthFailure = (err) => {
        setAuthFailed(true);
    };

    useEffect(() => {
        const values = queryString.parse(location.search);
        const state = values.state ? values.state : null;
        const code = values.code ? values.code : null;

        if (state && code) {
            googleAuthenticate(state, code, onAuthSuccess, onAuthFailure);
        }
    }, [location]);

    if (authFailed) {
        // TODO: show some error message and redirect to login page.
        return <Redirect to="/login"></Redirect>
    } else if (isAuthenticated) {
        return <Redirect to="/"></Redirect>
    }

    return (
        <PageLoader></PageLoader>
    );
};

export default connect(null, { googleAuthenticate })(Google);