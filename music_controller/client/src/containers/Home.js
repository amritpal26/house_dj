import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, Button, Typography } from '@material-ui/core';
import RoomsList from '../components/RoomsList';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    box: {
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '420px',
        minHeight: '420px',
        maxWidth: '720px',
        maxHeight: '720px',
        padding: theme.spacing(2),
    },
    paper: {
        flex: '1 1 auto',
        minHeight: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    roomsListContainer: {
        display: 'flex',
        flex: '0 1 auto',
        minHeight: '0',
        width: '100%',
        justifyContent: 'center',
    },
    buttonsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: theme.spacing(1)
    },
}));

const Home = ({ rooms }) => {
    const classes = useStyles();
    const history = useHistory();

    const isAnyRoom = (rooms && typeof rooms === 'object' && rooms.length > 0);
    const noRoomsMessage = (
        <div style={{ textAlign: 'center', margin: 'auto' }}>
            <Typography component='p' variant='h6'>
                No Rooms available
            </Typography>
            <Typography component='p' variant='body1'>
                You don't have any rooms linked to your account.<br />
                Create a room or join a room
            </Typography>
        </div>
    );
    return (
        <Box className={classes.box}>
            <Card className={classes.card} >
                <div className={classes.paper}>
                    <Typography component='h1' variant='h4'>
                        Welcome to House DJ!
                    </Typography>

                    {!isAnyRoom && noRoomsMessage}
                    {isAnyRoom && <div className={classes.roomsListContainer}>
                        <RoomsList 
                            rooms={rooms} 
                            onRoomSelect={(room) => {console.log(room)}} 
                        />
                    </div>}

                    <div className={classes.buttonsContainer}>
                        <Button
                            variant='outlined'
                            onClick= {() => history.push('/create-room')}
                        >Create Room
                        </Button>
                        <Button
                            variant='outlined'
                            onClick= {() => history.push('/join-room')}
                        >Join A Room
                        </Button>
                    </div>
                </div>
            </Card>
        </Box>
    );
}

const mapStateToProps = state => ({
    rooms: state.room.myRoomsList
});

export default connect(mapStateToProps, null)(Home);