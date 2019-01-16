import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import AlertsHeading from './AlertsHeading';
import AlertsList from './AlertsList';
import AlertsDialog from './AlertsDialog';

import sw from '../../customServiceWorker';
import axios from 'axios';

const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',
    },
});

class AlertsPage extends Component {

    state = {
    open: false,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleAccept = () => {
        this.setState({ open: false });
        sw.askPermission();
    }

    componentDidMount() {
        // clears any badge alerts
        this.props.dispatch({ type: 'CLEAR_ALERT_COUNT' });
        // this.props.dispatch({ type: 'FETCH_USER' });
        this.props.dispatch({ type: 'FETCH_ALERTS' })
        this.setState({
            open: this.props.user.push_endpoint ? false : true
        })
    }

    componentWillUnmount() {
        this.props.dispatch({ type: 'FETCH_USER' });
    }

    

    render() {
        const { classes, portfolioSymbols } = this.props;
        return (
            <div className={classes.root}>
                <AlertsDialog 
                    open={this.state.open}
                    handleClose={this.handleClose}
                    handleAccept={this.handleAccept}
                />
                <Grid container justify='center' spacing={16}>
                    <AlertsHeading />
                    <Grid item xs={11} md={9} lg={7}>
                        <AlertsList />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    portfolios: store.portfolios,
    portfolioSymbols: store.portfolioSymbols,
    user: store.user
})

export default connect(mapStateToProps)(withStyles(styles)(AlertsPage));