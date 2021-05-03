import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router';
import { googleAuthenticate } from '../actions/auth';
import PageLoader from '../components/PageLoader';
import queryString from 'query-string';

const Google = ({ googleAuthenticate }) => {
    const location = useLocation();

    useEffect(() => {
        const values = queryString.parse(location.search);
        const state = values.state ? values.state : null;
        const code = values.code ? values.code : null;

        console.log('State: ' + state);
        console.log('Code: ' + code);

        if (state && code) {
            // TODO: Navigate to homepage on success.

            googleAuthenticate(state, code);
        }
    }, [location]);

    return (
        <PageLoader></PageLoader>
    );
};

export default connect(null, { googleAuthenticate })(Google);