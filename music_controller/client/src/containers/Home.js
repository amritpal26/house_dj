import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Button, Typography } from '@material-ui/core';
import RoomsList from '../components/RoomsList';
import { useHistory } from 'react-router-dom';
import { getMyRooms } from '../actions/room'
import { showError } from '../actions/alert';

const useStyles = makeStyles((theme) => ({
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

const Home = ({ rooms, getMyRooms, showError }) => {
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        getMyRooms(null, (err) => { showError(err) });
    }, []);

    const editRoom = (room) => {
        if (room.is_host) {
            history.push(`/edit-room/${room.code}`);
        } else {
            showError('Only the host can edit room details');
        }
    }

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
        <Card className='card center' >
            <div className='paper'>
                <Typography component='h1' variant='h4'>
                    Welcome to House DJ!
                    </Typography>

                {!isAnyRoom && noRoomsMessage}
                {isAnyRoom && <div className={classes.roomsListContainer}>
                    <RoomsList
                        rooms={rooms}
                        onRoomEdit={(room) => editRoom(room)}
                        onRoomSelect={(room) => { console.log(room) }}
                    />
                </div>}

                <div className={classes.buttonsContainer}>
                    <Button
                        variant='outlined'
                        onClick={() => history.push('/create-room')}
                    >Create Room
                        </Button>
                    <Button
                        variant='outlined'
                        onClick={() => history.push('/join-room')}
                    >Join A Room
                        </Button>
                </div>
            </div>
        </Card>
    );
}

const mapStateToProps = state => ({
    rooms: state.room.myRoomsList
});

export default connect(mapStateToProps, { getMyRooms, showError })(Home);