import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../actions/auth';
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Card, Container, Avatar, TextField, Button, Typography, Box, FormControl } from "@material-ui/core";

import TextLine from '../components/TextLine';

const ResetPassword = ({ login, isAuthenticated }) => {

    return (
        <div>
            Reset Password Page
        </div>
    );
};

export default ResetPassword;