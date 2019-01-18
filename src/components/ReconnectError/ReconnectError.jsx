import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import deepOrange from '@material-ui/core/colors/deepOrange';

const disconnectColor = deepOrange[700];

const styles = theme => ({
    root: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: disconnectColor
    },
    text: {
        padding: theme.spacing.unit / 2,
        paddingRight: theme.spacing.unit * 5
    }
});

function ReconnectError(props) {
    const { classes } = props;

    return (
        <Paper className={classes.root} elevation={5}>
            <Typography variant="overline" align='right' className={classes.text}>
                Connection lost.  Trying to reconnect... Or try refreshing the page.
            </Typography>
        </Paper>
    );
}

export default withStyles(styles)(ReconnectError);