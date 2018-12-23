import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * 2,
    },
});

class UserPage extends Component {
    render() {
        const { classes } = this.props;
        const { user } = this.props;
        return (
            <Paper className={classes.root} elevation={1}>
                <Typography variant="h1">
                    Welcome, {user.name}!
                </Typography>
                <Typography component="p">
                    Your ID is: {user.id}
                </Typography>
            <LogOutButton className="log-in" />
            </Paper>
            // <img style={{borderRadius: '50%'}} src={user.facebook_image} alt="" />
        )
    }
}

const mapStateToProps = state => ({
  user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(withStyles(styles)(UserPage));
