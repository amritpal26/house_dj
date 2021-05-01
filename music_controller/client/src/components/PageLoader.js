import React from "react";
import ReactLoading from "react-loading";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    box: {
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center"
    }
}));

const PageLoader = () => {
    const classes = useStyles();
    const size = "128px"
    return (
        <Box className={classes.box}>
            <ReactLoading type="spin" height={size} width={size} color="#fff" />
        </Box>
    );

};

export default PageLoader;