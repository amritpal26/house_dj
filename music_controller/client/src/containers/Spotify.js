import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation, useHistory } from 'react-router';
import { spotifyAuthenticate } from '../actions/auth';
import { showError } from '../actions/alert';
import PageLoader from '../components/PageLoader';
import queryString from 'query-string';

const Spotify = ({ spotifyAuthenticate, showError }) => {
    const location = useLocation();
    const history = useHistory();

    const onAuthSuccess = (room) => {
        history.replace(`/room/${room.code}`);
    };

    const onAuthFailure = (err) => {
        showError(err || 'Something wrong happened. Try again');
        history.replace('/');
    };

    useEffect(() => {
        const values = queryString.parse(location.search);
        const code = values.code ? values.code : null;

        if (code) {
            spotifyAuthenticate(code, onAuthSuccess, onAuthFailure);
        }
    }, [location]);

    return (
        <PageLoader></PageLoader>
    );
};

export default connect(null, { spotifyAuthenticate, showError })(Spotify);