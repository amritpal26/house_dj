import { createMuiTheme } from '@material-ui/core/styles';
import { purple, green, blue, white } from '@material-ui/core/colors';

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
        h5: {
            color: white
        },
        h4: {
            color: white
        }
    },
});

export const Colors = {
    // Buttons
    FACEBOOK_BTN: blue[500],
    GOOGLE_BTN: blue[500],
    NAVBAR_LINKS_TEXT: '#fff'
};

export default theme;