import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        width: '100%',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.paper,
    },
    hero: {
        height: '92vh',
        backgroundColor: theme.palette.background.default,
    },
    mockup: {
        width: '100%'
    },
    title: {
        margin: theme.spacing.unit * 2
    },
    buttons: {
        margin: theme.spacing.unit * 2
    },
    button: {
        margin: theme.spacing.unit * 2
    }
});

class LandingPage extends Component {



    render() {
        const { classes, user } = this.props;
        return (
            <div className={classes.root}>
                <Grid container className={classes.hero} alignItems='center' justify='space-around' >
                    <Grid item xs={12} md={5}>
                        <img src='/images/coindock-mockup.png' className={classes.mockup} />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography className={classes.title} variant="h3" color="textPrimary">
                                    A Cross Platform Real-Time
                                </Typography>
                                <Typography className={classes.title} variant="h3" color="textPrimary">
                                    Cryptocurrency Tracking Application
                                </Typography>
                                {/* <Typography variant="h5" align={'center'} color="textSecondary">
                                    A Cross Platform Real-Time
                                </Typography>
                                <Typography variant="h5" align={'center'} color="textSecondary">
                                    Cryptocurrency Tracking Application
                                </Typography> */}
                            </Grid>
                            <Grid className={classes.buttons} item xs={12}>
                                <Grid container justify='center'>
                                    <Button variant="contained" size="large" color="default" className={classes.button}>
                                        Register
                                    </Button>
                                    <Button variant="contained" size="large" color="primary" className={classes.button}>
                                        Login
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justify='center'>
                            <ExpandMoreIcon color="primary" style={{ fontSize: 50 }}/>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default withStyles(styles)(LandingPage);