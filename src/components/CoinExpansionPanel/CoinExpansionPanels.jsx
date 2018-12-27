import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import CoinExpansionItem from './CoinExpansionItem';

import axios from 'axios';
import io from 'socket.io-client';

const styles = theme => ({
    root: {
        width: '100%',
    },
});

class CoinExpansionPanel extends Component {

    componentDidMount() {
        const socket = io('http://localhost:5000');
        socket.on('priceUpdate', (data) => {
            this.props.dispatch({
                type: 'UPDATE_TICKERS', payload:
                {
                    data: JSON.parse(data.data)
                }
            });
        })
    }

    render() {
        const { classes } = this.props;
        const { tickers } = this.props;
        return (
            <div className={classes.root}>
                {tickers.map( item => {
                    return (
                        <CoinExpansionItem key={item.id} coin={item} />
                    )
                })}
            </div>
        );
    }
}


const mapStateToProps = store => ({
        tickers: store.tickers,
    })

export default connect(mapStateToProps)(withStyles(styles)(CoinExpansionPanel));