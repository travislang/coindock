import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

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
        const { classes, tickers } = this.props;
        return (
            <div className={classes.root}>
                <Grid container justify='center' spacing={16}>
                    <SearchBar />
                    
                    <Grid item xs={11} md={9} lg={7}>
                        
                        {tickers.map(item => {
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

const mapStateToProps = state => ({
    tickers: state.tickers,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(withStyles(styles)(UserPage));
