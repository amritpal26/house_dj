import React from 'react';
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    container: {
        width: "100%",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));

const TextLine = (props) => {
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
    color: PropTypes.string
};

TextLine.defaultProps = {
    text: "",
    color: "black"
};

export default TextLine;