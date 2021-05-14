import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem, Button } from '@material-ui/core';
import { Fragment } from 'react';
import { Colors } from '../theme';

const ITEM_HEIGHT = 48;

const MemberList = ({ members }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const openList = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const closeList = () => {
        setAnchorEl(null);
    }

    return(
        <Fragment>
            <Button
                onClick={openList}
                style = {{ textTransform: 'none' }}
                >{`Members: ${members.length}`}
            </Button>
            <Menu
                elevation={0}
                keepMounted
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                open={Boolean(anchorEl)}
                onClose={closeList}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                        textColor: '#000',
                        backgroundColor: Colors.MEMBERS_LIST_BACKGROUND
                    },
                }}>
                {members.map((member) => (
                    <MenuItem 
                        key={member.id}
                        >{`${member.first_name} ${member.last_name}`}
                    </MenuItem>
                ))}
            </Menu>
        </Fragment>
    )
};

MemberList.propTypes = {
    members: PropTypes.array,
};

MemberList.defaultProps = {
    members: [],
};


export default MemberList;