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


const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',
    },
});

class UserPage extends Component {

    loadCoins = (page) => {
        console.log('in loadcoins');
        
        const amount = page * 20;
        this.props.dispatch({type: 'FETCH_TICKERS', payload: amount})
    }

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
                                    <CoinExpansionPanel key={item.id} coin={item} />
                                )
                            })}
                        </InfiniteScroll>
                        
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
