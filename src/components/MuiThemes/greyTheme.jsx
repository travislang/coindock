
import { createMuiTheme } from '@material-ui/core/styles';

import lightBlue from '@material-ui/core/colors/lightBlue';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';


const greyTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: lightBlue,
        secondary: deepOrange,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
        background: {
            paper: grey[800],
            default: '#303030',
        }
    },
});

export default greyTheme;