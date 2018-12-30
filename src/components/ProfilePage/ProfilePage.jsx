import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',
    },
    container: {
        marginTop: theme.spacing.unit * 7,
    },
    border: {
        border: `2px solid ${theme.palette.divider}`,
        borderRadius: '15px',
        padding: theme.spacing.unit * 3
    },
    avatar: {
        margin: 10,
        width: 120,
        height: 120,
    },
    label: {
        margin: theme.spacing.unit * 2,
        color: theme.palette.text.secondary
    }
});

class ProfilePage extends Component {



    render() {
        const { classes, user, portfolios } = this.props;

        return (
            <div className={classes.root}>
                <Grid container className={classes.container} alignItems='center' justify='center' >
                    <Grid item className={classes.border} xs={10} md={7} lg={4}>
                        <Grid container justify='center'>
                            {user.facebook_image !== 'none' ? <Avatar className={classes.avatar} alt="user profile image" src={user.facebook_image} /> : <AccountCircle className={classes.avatar} />}
                        </Grid>
                        <Typography gutterBottom color='textPrimary' align='center' variant="h3">
                            {user.name}
                        </Typography>
                        <Typography color='textPrimary' align='center' variant="body1" gutterBottom >
                            <span className={classes.label}>
                                Number Of Portfolios:
                            </span> 
                            {portfolios.portfolios && portfolios.portfolios.length}
                        </Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    portfolios: state.portfolios
});

export default connect(mapStateToProps)(withStyles(styles)(ProfilePage));