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
        //send socket obj with dispatch so it can start connection when the response gets back
        this.props.dispatch({ type: 'FETCH_PORTFOLIOS', socket: socket })
        socket.on('portfolioUpdate', ({msg, btc, eth}) => {
            this.props.dispatch({ type: 'UPDATE_PORTFOLIO_SYMBOLS', payload: {msg, btc, eth}})
        })
    }

    componentWillUnmount() {
        // close 
        const socket = this.context;
        console.log('unmounting portfolio page');
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