import React, { Component } from 'react';
import { connect } from 'react-redux';
import SocketContext from '../SocketContext';
import io from 'socket.io-client';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


import CoinExpansionPanel from '../CoinExpansionPanel/CoinExpansionPanel';
import SearchBar from '../SearchBar/SearchBar';

import { withSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center'
    },
    progress: {
        margin: theme.spacing.unit * 5,
    }
});

class UserPage extends Component {
    // static contextType = ThemeContext;
    loadCoins = (page) => {
        console.log('in loadcoins');
        const amount = page * 20;
        this.props.dispatch({type: 'FETCH_TICKERS', payload: amount})
    }

    snackbarControl = (name) => {
        const { enqueueSnackbar } = this.props;
        enqueueSnackbar(`${name} was added to portfolio`, {
            variant: 'success',
            autoHideDuration: 5000
        })
    }

    componentDidMount() {
        const socket = this.context;
        this.props.dispatch({ type: 'FETCH_TICKER_NAMES' })
        socket.on('allTickers', (data) => {
            // console.log(data.msg);
            this.props.dispatch({
                type: 'UPDATE_TICKERS', payload:
                {
                    data: JSON.parse(data.msg)
                }
            });
        })
        socket.emit('joinAllTickers')
    }

    componentWillUnmount() {
        const socket = this.context;
        //leave allTickers room
        socket.emit('leaveAllTickers');
    }

    render() {
        const { classes, tickers, tickerNames } = this.props;
        //check to see if there is more tickers to load from DB
        const hasMore = tickers.length < tickerNames.length;
        
        return (
            <div className={classes.root}>
                <Grid container justify='center' spacing={16}>
                    <SearchBar />
                    <Grid item xs={11} md={9} lg={7}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadCoins}
                            hasMore={hasMore}
                            loader={
                                <div className={classes.spinner}>
                                    <CircularProgress className={classes.progress} />
                                </div>
                            }
                        >
                            {tickers.map(item => {
                                return (
                                    <CoinExpansionPanel 
                                        key={item.id} 
                                        coin={item} 
                                        snackbarControl={this.snackbarControl}
                                    />
                                )
                            })}
                        </InfiniteScroll>
                        
                    </Grid>
                </Grid>
            </div>
        )
    }
}

UserPage.contextType = SocketContext;

const mapStateToProps = state => ({
    tickers: state.tickers,
    tickerNames: state.tickerNames
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(withStyles(styles)(withSnackbar(UserPage)));
