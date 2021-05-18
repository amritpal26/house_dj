import { createMuiTheme } from '@material-ui/core/styles';
import { purple, green, blue } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: green[500],
        }
    },
    typography: {
        h4: {
            color: '#000',
            '@media (max-width: 480px)': {
                fontSize: '1.7rem',
            },
        },
        h5: {
            color: '#000',
            '@media (max-width: 480px)': {
                fontSize: '0.9rem',
            },
        },
        h6: {
            '@media (max-width: 480px)': {
                fontSize: '0.7rem',
            },
        },
        subtitle1: {
            '@media (max-width: 480px)': {
                fontSize: '0.7rem',
            },
        }
    },
    overrides: {
        MuiCard: {
            root: {
                overflow: 'scroll'
            }
        }
    }
});

export const Colors = {
    // Buttons
    FACEBOOK_BTN: blue[500],
    GOOGLE_BTN: blue[500],
    NAVBAR_LINKS_TEXT: '#fff',
    MEMBERS_LIST_BACKGROUND: purple[100],
};

export default theme;