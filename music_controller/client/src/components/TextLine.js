import React from 'react';
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const TextLine = (props) => {
    
    const useStyles = makeStyles(() => ({
        container: {
            width: "100%",
            marginTop: props.marginTop,
            marginBottom: props.marginBottom
        }
    }));

    const classes = useStyles();
    return (
        <div className={classes.container} >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div style={{ flex: 1, height: 1, backgroundColor: props.color }} />
                <div>
                    <span style={{ width: 50, textAlign: 'center', color: props.color, margin: "0px 16px" }}>{ props.text }</span>
                </div>
                <div style={{ flex: 1, height: 1, backgroundColor: props.color }} />
            </div>
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