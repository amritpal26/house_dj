import React from 'react';
import PropTypes from "prop-types";
import {
    Album as AlbumIcon,
    Delete as DeleteIcon,
    Edit as EditIcon
} from '@material-ui/icons';
import {
    withStyles,
    makeStyles,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Avatar,
    IconButton,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: { 
        display: 'flex', 
        width: '100%',
    },
    list: {
        width: '100%',
        marginTop: theme.spacing(1),
        position: 'relative',
        overflow: 'auto',
    },
}));

const ListItemTwoActions = withStyles({
    secondaryAction: {
        paddingRight: 96
    }
})(ListItem);

const RoomsList = ({ rooms }) => {
    const classes = useStyles();

    const getRoomDetails = (room) => {
        if (room.guest_can_pause) return `votes to skip: ${room.votes_to_skip}; Guest can pause`
        else return `votes to skip: ${room.votes_to_skip}`
    }

    const selectRoom = (room) => {
        console.log('select room: ', room);
    }

    const editRoom = (room) => {
        console.log('edit room: ', room);
    }

    const deleteRoom = (room) => {
        console.log('delete room: ', room);
    }
    const isAnyRoom = (rooms && typeof rooms === 'object' && rooms.length > 0);
    return (
        <div className={classes.root}>
            {isAnyRoom && <List className={classes.list}>
                {rooms.map((room) =>
                    <ListItemTwoActions
                        key={room.id}
                        button
                        onClick={() => selectRoom(room)}>
                        <ListItemAvatar>
                            <Avatar>
                                <AlbumIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={room.title}
                            secondary={getRoomDetails(room)}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => editRoom(room)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => deleteRoom(room)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItemTwoActions>,
                )}
            </List>}
        </div>
    );
};

RoomsList.propTypes = {
    rooms: PropTypes.array,
    onRoomSelect: PropTypes.func,
};

RoomsList.defaultProps = {
    rooms: [],
    onRoomSelect: null
};

export default RoomsList;