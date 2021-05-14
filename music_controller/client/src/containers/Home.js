import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Button, Typography } from '@material-ui/core';
import RoomsList from '../components/RoomsList';
import { useHistory } from 'react-router-dom';
import { getMyRooms, leaveRoom } from '../actions/room'
import { showSuccess, showError } from '../actions/alert';

const useStyles = makeStyles((theme) => ({
    roomsListContainer: {
        display: 'flex',
        flex: '0 1 auto',
        flexGrow: 1,
        minHeight: '0',
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    buttonsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: theme.spacing(1)
    },
    noRoomsMessage: {
        textAlign: 'center',
        margin: 'auto',
    }
}));

const Home = ({ rooms, getMyRooms, leaveRoom, showSuccess, showError }) => {
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
    };

    const onRoomLeaveSuccess = (msg) => {
        showSuccess(msg || 'Left room');
    };

    const onRoomLeaveFailure = (err) => {
        showError(err || 'Error occured while leaving room')
    };

    const isAnyRoom = (rooms && typeof rooms === 'object' && rooms.length > 0);
    const onCreateRoom = () => {
        if (isAnyRoom) {
            showError('Leave the current room to create a new room');
        } else {
            history.push('/create-room');
        }
    };

    const onJoinRoom = () => {
        if (isAnyRoom) {
            showError('Leave the current room to join a new room');
        } else {
            history.push('/join-room');
        }
    };
    
    const sorted_rooms = [
        { title: 'Hosted Rooms', rooms: rooms.filter((room) => room.is_host) },
        { title: 'Member Rooms', rooms: rooms.filter((room) => !room.is_host) },
    ]

    const RoomsHeader = ({ title }) => (
        <Typography component='h6' variant='h6'>
            {title}
        </Typography>
    );
    const noRoomsMessage = (
        <div className={classes.noRoomsMessage}>
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
                {sorted_rooms.map(type => {
                    return (type.rooms.length > 0 && <div className={classes.roomsListContainer} key={type.title}>
                        <RoomsHeader title={type.title}/>
                        <RoomsList
                            rooms={type.rooms}
                            onRoomEdit={(room) => editRoom(room)}
                            onRoomSelect={(room) => history.push(`/room/${room.code}`)}
                            onRoomLeave={(room) => leaveRoom(room.code, onRoomLeaveSuccess, onRoomLeaveFailure)}
                        />
                    </div>);
                })}

                <div className={classes.buttonsContainer}>
                    <Button
                        variant='outlined'
                        onClick={onCreateRoom}
                    >Create Room
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={onJoinRoom}
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

export default connect(mapStateToProps, { getMyRooms, leaveRoom, showSuccess, showError })(Home);