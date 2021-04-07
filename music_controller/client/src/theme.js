import { createMuiTheme } from '@material-ui/core/styles';
import { purple, green, red, white, black } from '@material-ui/core/colors';

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
            color: "white"
        },
        h4: {
            color: white
        }
    },
});

export default theme;