import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router';
import { facebookAuthenticate } from '../actions/auth';
import PageLoader from '../components/PageLoader';
import queryString from 'query-string';

const Facebook = ({ facebookAuthenticate }) => {
    const location = useLocation();

    useEffect(() => {
        const values = queryString.parse(location.search);
        const state = values.state ? values.state : null;
        const code = values.code ? values.code : null;

        if (state && code) {
            facebookAuthenticate(state, code);

            // TODO: Navigate to homepage on success.
        }
    }, [location]);

    return (
        <PageLoader></PageLoader>
    );
};

export default connect(null, { facebookAuthenticate })(Facebook);