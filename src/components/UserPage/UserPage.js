import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import CoinExpansionPanel from '../CoinExpansionPanel/CoinExpansionPanels';

const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',

    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * 5,
    }
});

class UserPage extends Component {
    render() {
        const { classes } = this.props;
        const { user } = this.props;
        return (
            <div className={classes.root}>
                <Grid container justify='center' spacing={24}>
                    <Grid item xs={12} md={9} lg={7}>
                        <CoinExpansionPanel />
                    </Grid>
                </Grid>
            </div>
            // <Paper className={classes.paper} elevation={1}>
            //     <Typography variant="h2">
            //         Welcome, {user.name}!
            //                 </Typography>
            //     <Typography component="p">
            //         Your ID is: {user.id}
            //     </Typography>
            //     <LogOutButton className="log-in" />
            // </Paper>
        )
    }
}

const mapStateToProps = state => ({
  user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(withStyles(styles)(UserPage));
