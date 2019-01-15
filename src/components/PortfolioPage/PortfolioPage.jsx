import React, { Component } from 'react';
import { connect } from 'react-redux';
import SocketContext from '../SocketContext';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import PortfolioSelect from './PortfolioSelect';
import PortfolioList from './PortfolioList';
import Loader from '../UserPage/Loader';


const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',
    },
    loadingRoot: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    }
});

class PortfolioPage extends Component {

    componentDidMount() {
        const socket = this.context;
        //send socket obj with dispatch so it can start connection when the response gets back
        this.props.dispatch({ type: 'FETCH_PORTFOLIOS', socket: socket })
        socket.on('portfolioUpdate', ({msg, btc, eth}) => {
            this.props.dispatch({ type: 'UPDATE_PORTFOLIO_SYMBOLS', payload: {msg, btc, eth}})
        })

        socket.on('reconnect', () => {
            console.log('reconnected', socket.id);
            socket.emit('portfolioStream', this.props.portfolioSymbols)
        })
    }

    componentWillUnmount() {
        const socket = this.context;
        // close socket connection to portfolioStream
        socket.emit('closePortfolioWs');
    }

    render() {
        const { classes, portfolioSymbols, loading } = this.props;
        return (
            <div className={classes.root}>
                <Grid container justify='center' spacing={16}>
                    <PortfolioSelect />
                    <Grid item xs={11} md={9} lg={7}>
                        {loading ? 
                            <Grid container alignItems='center' justify='center'>
                                <Loader />
                            </Grid>
                            // <div className={classes.loadingRoot}>
                            //     <Loader />
                            // </div> 
                            : 
                            <PortfolioList />}
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
    portfolioSymbols: store.portfolioSymbols,
    loading: store.loading
})

export default connect(mapStateToProps)(withStyles(styles)(PortfolioPage));