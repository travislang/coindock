import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


import CoinExpansionPanel from '../CoinExpansionPanel/CoinExpansionPanels';
import SearchBar from '../SearchBar/SearchBar';

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
                <Grid container justify='center' spacing={16}>
                    <SearchBar />
                    <Grid item xs={11} md={9} lg={7}>
                        <CoinExpansionPanel />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => ({
  user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(withStyles(styles)(UserPage));
