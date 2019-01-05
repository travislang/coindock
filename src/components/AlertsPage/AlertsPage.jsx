import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import AlertsHeading from './AlertsHeading';
import AlertsList from './AlertsList';

const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',
    },
});

class AlertsPage extends Component {

    

    render() {
        const { classes, portfolioSymbols } = this.props;
        return (
            <div className={classes.root}>
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
    portfolioSymbols: store.portfolioSymbols
})

export default connect(mapStateToProps)(withStyles(styles)(AlertsPage));