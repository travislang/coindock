
import {createMuiTheme } from '@material-ui/core/styles';

import lightBlue from '@material-ui/core/colors/lightBlue';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';


const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: lightBlue,
        secondary: deepOrange,
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