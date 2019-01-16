import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '30vh',
        padding: theme.spacing.unit * 3
    },
    container: {
        marginTop: theme.spacing.unit * 7,
    },
    avatar: {
        margin: 10,
        width: 120,
        height: 120,
    },
    label: {
        margin: theme.spacing.unit * 2,
        color: theme.palette.text.secondary
    },
    editButton: {
        color: 'rgba(255, 255, 255, 0.5)',
        marginLeft: theme.spacing.unit * 2,
    },
    spacingText: {
        marginBottom: theme.spacing.unit * 3
    }
});

class ProfilePage extends Component {



    render() {
        const { classes, user, portfolios, alerts } = this.props;

        return (
            <Grid container className={classes.container} alignItems='center' justify='center' >
                <Grid item xs={10} md={7} lg={4}>
                    <Paper className={classes.root} elevation={10}>
                    <Grid container justify='center'>
                        {user.facebook_image !== 'none' ? <Avatar className={classes.avatar} alt="user profile image" src={user.facebook_image} /> : <AccountCircle className={classes.avatar} />}
                    </Grid>
                    <Typography gutterBottom color='textPrimary' align='center' variant="h3">
                        {user.name}
                    </Typography>
                    <Typography color='textPrimary' align='center' variant="body1" gutterBottom >
                        Username
                        <EditIcon className={classes.editButton} fontSize='small' />
                    </Typography>
                        <Typography className={classes.spacingText} color='textPrimary' align='center' variant="body1" gutterBottom >
                        Password
                        <EditIcon className={classes.editButton} fontSize='small' />
                    </Typography>
                    <Typography color='textPrimary' align='center' variant="body1" gutterBottom >
                        <span className={classes.label}>
                            Number of portfolios:
                        </span>
                        {portfolios.portfolios && portfolios.portfolios.length}
                    </Typography>
                    <Typography color='textPrimary' align='center' variant="body1" gutterBottom >
                        <span className={classes.label}>
                            Number of active alerts:
                        </span>
                        {alerts.length}
                    </Typography>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    portfolios: state.portfolios,
    alerts: state.alerts
});

export default connect(mapStateToProps)(withStyles(styles)(ProfilePage));