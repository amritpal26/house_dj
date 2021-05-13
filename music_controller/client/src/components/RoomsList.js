import React from 'react';
import PropTypes from "prop-types";
import {
    Album as AlbumIcon,
    ExitToApp as ExitToAppIcon,
    Edit as EditIcon
} from '@material-ui/icons';
import {
    withStyles,
    makeStyles,
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

const RoomsList = ({ rooms, onRoomSelect, onRoomEdit, onRoomLeave }) => {
    const classes = useStyles();

    const getRoomDetails = (room) => {
        if (room.guest_can_pause) return `votes to skip: ${room.votes_to_skip}; Guest can pause`
        else return `votes to skip: ${room.votes_to_skip}`
    }

    const selectRoom = (room) => {
        onRoomSelect && onRoomSelect(room);
    }

    const editRoom = (room) => {
        onRoomEdit && onRoomEdit(room);
    }

    const leaveRoom = (room) => {
        onRoomLeave && onRoomLeave(room);
    }

    return (
        <div className={classes.root}>
            <List className={classes.list}>
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
                            <IconButton edge="end" aria-label="delete" onClick={() => leaveRoom(room)}>
                                <ExitToAppIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItemTwoActions>,
                )}
            </List>
        </div>
    );
};

RoomsList.propTypes = {
    rooms: PropTypes.array,
    onRoomSelect: PropTypes.func,
    onRoomEdit: PropTypes.func,
    onRoomLeave: PropTypes.func
};

RoomsList.defaultProps = {
    rooms: [],
    onRoomSelect: null,
    onRoomEdit: null,
    onRoomLeave: null
};

export default RoomsList;