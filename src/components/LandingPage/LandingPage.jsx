import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { NavLink, Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PlayArrow from '@material-ui/icons/PlayArrow';

import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import LaptopMac from '@material-ui/icons/LaptopMac';


const styles = theme => ({
    root: {
        minHeight: 'calc(100vh - 65px)',
        backgroundColor: theme.palette.background.default,
    },
    hero: {
        minHeight: '100%',
    },
    secondaryGroup: {
        minHeight: '100vh',
        backgroundColor: theme.palette.background.paper,
    },
    secondaryColumn: {
        minHeight: '100%'
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
    },
});

class LandingPage extends Component {



    render() {
        const { classes, user } = this.props;
        return (
            <div>
                <Grid container direction='column' justify='space-around' className={classes.root}>
                    <Grid container alignItems='center' className={classes.hero} justify='space-around' >
                        <Grid item xs={12} md={5}>
                            <img src='/images/main-coindock.png' className={classes.mockup} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Grid container alignItems='flex-start'>
                                <Grid item xs={12}>
                                    <Typography className={classes.title} variant="h4" color="textSecondary">
                                        A Cross Platform Cryptocurrency Tracking Application
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <PlayArrow color='primary' />
                                            </ListItemIcon>
                                            <ListItemText
                                                primaryTypographyProps={'color'}
                                                color='textSecondary'
                                                primary="Real-Time Prices"
                                                secondary={null}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <PlayArrow color='primary' />
                                            </ListItemIcon>
                                            <ListItemText
                                                primaryTypographyProps={'color'}
                                                color='textSecondary'
                                                primary="Create multiple portfolios to organize your coins"
                                                secondary={null}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <PlayArrow color='primary' />
                                            </ListItemIcon>
                                            <ListItemText
                                                primaryTypographyProps={'color'}
                                                color='textSecondary'
                                                primary="Set price points and recieve push alerts"
                                                secondary={null}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid className={classes.buttons} item xs={12}>
                                    <Grid container justify='flex-start'>
                                        <Button
                                            component={Link}
                                            to='/home'
                                            variant="contained"
                                            size="large"
                                            color="default"
                                            className={classes.button}>
                                            Register
                                    </Button>
                                        <Button
                                            component={Link}
                                            to='/home'
                                            variant="contained"
                                            size="large"
                                            color="primary"
                                            className={classes.button}>
                                            Login
                                    </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justify='center'>
                            <ExpandMoreIcon color="primary" style={{ fontSize: 50}} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container className={classes.secondaryGroup}>
                    <Grid item xs={12} md={6}>
                        <Grid container alignItems='center' justify='center' className={classes.secondaryColumn}>
                            <Grid item xs={10}>
                                <Typography className={classes.title} gutterBottom variant="h3" align='center' color="primary">
                                    Push Notifications
                                </Typography>
                                <Typography className={classes.title} variant="h5" align='center' color="textPrimary">
                                    CoinDock utilizes push notifications to always keep users up
                                    to date on fluctuating cryptocurrency prices.  Users have fine-grained control over their alerts, including turning individual alerts on & off, and the option of turning all alerts on or off at once.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid container alignItems='center' justify='center' className={classes.secondaryColumn}>
                            <Grid item xs={10}>
                                <img src='/images/coindock-alerts.png' className={classes.mockup} />
                            </Grid>
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