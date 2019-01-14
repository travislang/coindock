import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';

import IntegrationDownshift from '../Autoselect/Autoselect';

const styles = theme => ({
    paper: {
        padding: theme.spacing.unit,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginTop: theme.spacing.unit * 2,
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-between'
    },
    search: {
        position: 'relative',
        borderRadius: '25px',
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        width: '65%',
        [theme.breakpoints.up('md')]: {
            marginLeft: theme.spacing.unit * 3,
            marginRight: theme.spacing.unit * 3,
            width: '50%',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: theme.palette.text.primary,
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    activePortfolio: {
        color: theme.palette.primary.dark,
        [theme.breakpoints.up('md')]: {
            marginLeft: theme.spacing.unit * 3,
            marginRight: theme.spacing.unit * 3,
        },
    },
})

class SearchBar extends Component {

    handleSelection = (selection) => {
        console.log('you selected an item', selection);
        this.props.dispatch({type: 'SET_SEARCH_TRUE'})
        this.props.dispatch({ type: 'FETCH_SEARCH_TICKER', payload: selection.id})
    }

    render() {
        const { classes, portfolios } = this.props;
        return (
            <Grid item xs={11} md={9} lg={7}>
                <Paper className={classes.paper} elevation={3}>
                    <div className={classes.activePortfolio}>
                        <Typography variant="caption">
                            Current Portfolio:
                        </Typography>
                        <Typography color='inherit' variant="body1">
                            {portfolios.activePortfolio && portfolios.activePortfolio[0] && portfolios.activePortfolio[0].portfolio_name}
                        </Typography>
                    </div>
                    <IntegrationDownshift handleSelection={this.handleSelection} message='Filter Coins...' />
                </Paper>
            </Grid>
        )
    }
}

const mapStateToProps = store => ({
    portfolios: store.portfolios,
})

export default connect(mapStateToProps)(withStyles(styles)(SearchBar));