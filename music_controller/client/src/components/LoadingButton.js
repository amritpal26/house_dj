import React, { Fragment } from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        margin: theme.spacing(1),
        position: 'relative',
        width: '100%',

    },
    buttonProgress: {
        color: [500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

const LoadingButton = (props) => {
    const classes = useStyles();

    return (
        <Fragment>
            <div className={classes.wrapper}>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth={props.fullWidth}
                    disabled={props.isLoading}
                    onClick={props.onClick}
                >
                    {props.children}
                </Button>
                {props.isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
        </Fragment>
    );
};

LoadingButton.propTypes = {
    children: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string,
        ]).isRequired,
    isLoading: PropTypes.bool,
    fullWidth: PropTypes.bool,
    onClick: PropTypes.func
};

LoadingButton.defaultProps = {
    isLoading: false,
    onClick: null,
    fullWidth: false
};

export default LoadingButton;
