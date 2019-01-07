import React, { Component } from 'react';
import { connect } from 'react-redux';
import SocketContext from '../SocketContext';

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
        const socket = this.context;
        //best way to do this async? put dispatch in class init constructor?
        this.props.dispatch({ type: 'FETCH_PORTFOLIOS' })
        // //make sure the client has the data before sending it
        setTimeout(() => {
            socket.emit('portfolioStream', this.props.portfolioSymbols)
        }, 3000)
        socket.on('portfolioUpdate', ({msg, btc, eth}) => {
            console.log('portfolio price update:', msg, btc, eth);
            this.props.dispatch({ type: 'UPDATE_PORTFOLIO_SYMBOLS', payload: {msg, btc, eth}})
        })
        
    }

    componentWillUnmount() {
        const socket = this.context;
        socket.emit('closePortfolioWs');
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

//getting socket instance context
PortfolioPage.contextType = SocketContext;

const mapStateToProps = store => ({
    portfolios: store.portfolios,
    portfolioSymbols: store.portfolioSymbols
})

export default connect(mapStateToProps)(withStyles(styles)(PortfolioPage));