import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import CoinExpansionPanel from '../CoinExpansionPanel/CoinExpansionPanel';
import SearchBar from '../SearchBar/SearchBar';

import Snackbar from '@material-ui/core/Snackbar';
import AlertSnackbar from '../AlertSnackbar/AlertSnackbar';
import Slide from '@material-ui/core/Slide';

const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',
    },
});

class UserPage extends Component {
    queue = [];

    state = {
        expanded: null,
        open: false,
        messageInfo: {}
    };

    //function to fetch more coins as user scrolls
    loadCoins = (page) => {
        const amount = page * 20;
        this.props.dispatch({type: 'FETCH_TICKERS', payload: amount})
    }
    // handles snackbar close
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ open: false })
    };

    openSnackbar = (name) => {
        console.log('in open snackbar');
        
        this.queue.push({
            name: name,
            key: new Date().getTime(),
        });
        if (this.state.open) {
            // immediately begin dismissing current message
            // to start showing new one
            this.setState({ open: false });
        } else {
            this.processQueue();
        }
    }

    processQueue = () => {
        if (this.queue.length > 0) {
            this.setState({
                messageInfo: this.queue.shift(),
                open: true,
            });
        }
    };

    handleExited = () => {
        this.processQueue();
    };

    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_PORTFOLIOS' })
        this.props.dispatch({ type: 'FETCH_TICKER_NAMES' })
        // const socket = io('http://localhost:5000');
        // socket.on('priceUpdate', (data) => {
        //     this.props.dispatch({
        //         type: 'UPDATE_TICKERS', payload:
        //         {
        //             data: JSON.parse(data.data)
        //         }
        //     });
        // })
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
                            loader={<div className="loader" key={0}>Loading ...</div>}
                        >
                            {tickers.map(item => {
                                return (
                                    <CoinExpansionPanel key={item.id} coin={item} openSnackbar={this.openSnackbar} />
                                )
                            })}
                        </InfiniteScroll>
                        <Snackbar
                            key={this.state.messageInfo.key}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            TransitionComponent={Slide}
                            TransitionProps={{ direction: "right" }}
                            open={this.state.open}
                            autoHideDuration={5000}
                            onClose={this.handleClose}
                            onExited={this.handleExited}
                        >
                            <AlertSnackbar
                                variant='success'
                                message='added to portfolio'
                                name={this.state.messageInfo.name}
                                handleClose={this.handleClose}
                            />
                        </Snackbar>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    tickers: state.tickers,
    tickerNames: state.tickerNames
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(withStyles(styles)(UserPage));
