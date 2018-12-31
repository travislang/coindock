import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import CoinExpansionPanel from '../CoinExpansionPanel/CoinExpansionPanel';
import PortfolioSelect from './PortfolioSelect';

const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',
    },
});

class PortfolioPage extends Component {

    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_PORTFOLIOS' })
    }

    render() {
        const { classes, portfolioSymbols } = this.props;
        return (
            <div className={classes.root}>
                <Grid container justify='center' spacing={16}>
                    <PortfolioSelect />
                    <Grid item xs={11} md={9} lg={7}>
                        {portfolioSymbols.map(item => {
                            return (
                                <CoinExpansionPanel key={item.id} coin={item} />
                            )
                        })}
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

export default connect(mapStateToProps)(withStyles(styles)(PortfolioPage));