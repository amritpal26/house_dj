import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Configs from "../configs";

const DEFAULT_VOTES_TO_SKIP = Configs.constants.DEFAULT_VOTES_TO_SKIP;
const DEFAULT_GUEST_CAN_PAUSE = Configs.constants.DEFAULT_GUEST_CAN_PAUSE;

const useStyles = makeStyles({
    root: {
        minWidth: 350,
        maxWidth: 450
    },
    divider: {
        width: 10
    }
});

export default function EditRoom(props) {
    const [guestCanPause, setGuestCanPause] = useState(DEFAULT_GUEST_CAN_PAUSE);
    const [votesToSkip, setVotesToSkip] = useState(DEFAULT_VOTES_TO_SKIP);
    const classes = useStyles();

    const onGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.checked);
    };

    const onVotesToSkipChanged = (e) => {
        setVotesToSkip(e.target.value);
    };

    const onCancel = (e) => {
        console.log('cancel room creation', e);
    };

    const onCreateRoom = (e) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            }),
        };

        fetch('/api/create-room', requestOptions)
            .then((response) => response.json())
            .then((room) => {
                console.log(room)
                props.history.push('/room/' + room.code)
            });
    };

    return (
        <Card className={classes.root} elevation={4} variant="elevation">
            <CardContent>
                <Grid container direction="column" spacing={1}>

                    <Grid item xs={12} align="center">
                        <Typography component="h3" variant="h3">Create A Room</Typography>
                    </Grid>

                    <Grid item xs={12} align="center">
                        <Divider></Divider>
                    </Grid>

                    <Grid item xs={12} align="center">
                        <FormControl component="fieldset">
                            <FormControlLabel
                                control={
                                    <Switch color="primary"
                                        defaultChecked={DEFAULT_GUEST_CAN_PAUSE} 
                                        onChange={onGuestCanPauseChange}
                                    />}
                                label="Guest can pause/play music"
                                labelPlacement="start"
                                />
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} align="center">
                        <FormControl>
                            <TextField
                                defaultValue={DEFAULT_VOTES_TO_SKIP}
                                required={true}
                                size="small"
                                type="number"
                                onChange={onVotesToSkipChanged}
                                helperText="Votes required to skip a song"
                                inputProps={{
                                    min: 1,
                                    style: { textAlign: "center" }
                                }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>

            <CardActions>
                <Grid container justify="center" spacing={2}>
                    <Grid item>
                        <Button 
                            size="small" 
                            color="secondary" 
                            variant="outlined" 
                            onClick={onCancel}>Cancel</Button>
                    </Grid>
                    <Grid item>
                        <Button 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                            onClick={onCreateRoom}>Create</Button>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}