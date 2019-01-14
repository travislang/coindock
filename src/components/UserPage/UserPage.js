import React, { Component } from 'react';
import { connect } from 'react-redux';
import SocketContext from '../SocketContext';
import io from 'socket.io-client';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import List from '@material-ui/core/List';
import HomeListItem from './HomeListItem';
import SearchBar from '../SearchBar/SearchBar';

import { withSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',
    },
    listRoot: {
        width: '100%',
        // backgroundColor: theme.palette.background.paper,
        padding: 0
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

    snackbarControl = (name, variantType) => {
        const { enqueueSnackbar } = this.props;
        if(variantType === 'success') {
            enqueueSnackbar(`${name} was added to portfolio`, {
                variant: 'success',
                autoHideDuration: 4000
            })
        }
        else if(variantType === 'error') {
            enqueueSnackbar(`${name} is already in portfolio`, {
                variant: 'error',
                autoHideDuration: 4000
            })
        }
        
    }

    componentDidMount() {
        const socket = this.context;
        // so it shows all symbols
        this.props.dispatch({ type: 'SET_SEARCH_FALSE' })
        this.props.dispatch({ type: 'CLEAR_TICKERS' })
        this.props.dispatch({ type: 'FETCH_PORTFOLIOS' })
        this.props.dispatch({ type: 'FETCH_TICKER_NAMES' })
        socket.on('allTickers', ({msg, btc, eth}) => {
            this.props.dispatch({
                type: 'UPDATE_TICKERS', payload: { msg, btc, eth }
            });
        })
        socket.emit('joinAllTickers')
        // if socket loses connection it will rejoin room on reconnect
        socket.on('reconnect', () => {
            socket.emit('joinAllTickers')
        })
    }

    componentWillUnmount() {
        const socket = this.context;
        //leave allTickers room
        socket.emit('leaveAllTickers');
        console.log('unmounting home');
        
    }

    render() {
        const { classes, tickers, tickerNames, search } = this.props;
        //check to see if there is more tickers to load from DB
        const hasMore = tickers.length < tickerNames.length;
        
        return (
            <div className={classes.root}>
                <Grid container justify='center' spacing={16}>
                    <SearchBar />
                    <Grid item xs={11} md={9} lg={7}>
                        <List className={classes.listRoot}>
                            {!search ? 
                                <InfiniteScroll
                                    pageStart={-1}
                                    loadMore={this.loadCoins}
                                    hasMore={hasMore}
                                    loader={
                                        <div key={1} className={classes.spinner}>
                                            <CircularProgress className={classes.progress} />
                                        </div>
                                    }
                                >
                                    {tickers.map((item) => {
                                        return (
                                            <HomeListItem
                                                key={item.id}
                                                coin={item}
                                                snackbarControl={this.snackbarControl}
                                            />
                                        )
                                    })}
                                </InfiniteScroll>
                                : 
                                tickers.map((item) => {
                                    return (
                                        <HomeListItem
                                            key={item.id}
                                            coin={item}
                                            snackbarControl={this.snackbarControl}
                                        />
                                    )
                                })
                            }
                        </List>
                        
                    </Grid>
                </Grid>
            </div>
        )
    }
}

UserPage.contextType = SocketContext;

const mapStateToProps = state => ({
    tickers: state.tickers,
    tickerNames: state.tickerNames,
    search: state.search
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(withStyles(styles)(withSnackbar(UserPage)));
