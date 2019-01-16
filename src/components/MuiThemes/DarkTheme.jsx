
import {createMuiTheme } from '@material-ui/core/styles';

import lightBlue from '@material-ui/core/colors/lightBlue';
import deepOrange from '@material-ui/core/colors/deepOrange';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';


const darkTheme = createMuiTheme({
    
    palette: {
        type: 'dark',
        primary: lightBlue,
        secondary: {
            main: red[700],
        },
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
        background: {
            paper: '#303030',
            default: grey[900],
        }
    },
});

export default darkTheme;