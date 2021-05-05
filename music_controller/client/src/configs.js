const Constants = {
    // App 
    APP_NAME: 'House DJ',

    PASSWORD_MIN_LENGTH: 6,

    // Room
    DEFAULT_GUEST_CAN_PAUSE: true,
    DEFAULT_VOTES_TO_SKIP: 2,
};

const noAuthPathnames = [
    '/google', 
    '/facebook', 
    '/login', 
    '/signup', 
    '/activate/:uid/:token',
    '/reset-password',
    '/password/reset/confirm/:uid/:token'
];

export default {
    constants: Constants,
    NoAuthPaths: noAuthPathnames
}