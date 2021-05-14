import React from 'react';
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const TextLine = (props) => {

    const useStyles = makeStyles(() => ({
        container: {
            width: "100%",
            marginTop: props.marginTop,
            marginBottom: props.marginBottom,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        },
        text: {
            flexShrink: '1',
            textAlign: 'center',
            color: props.color,
            margin: "0px 8px",
        },
        line: {
            flex: '1',
            height: '1px', 
            backgroundColor: props.color
        }
    }));

    const classes = useStyles();
    return (
        <div className={classes.container} >
            <div className={classes.line} />
            <span className={classes.text}>{ props.text }</span>
            <div className={classes.line} />
        </div>
    )
};

TextLine.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    marginTop: PropTypes.any,
    marginBottom: PropTypes.any,
};

TextLine.defaultProps = {
    text: "",
    color: "black",
    marginTop: 0,
    marginBottom: 0
};

export default TextLine;