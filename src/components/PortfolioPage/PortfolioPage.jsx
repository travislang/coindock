import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';


import PortfolioSelect from './PortfolioSelect';
import PortfolioList from './PortfolioList';

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
                        <PortfolioList />
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