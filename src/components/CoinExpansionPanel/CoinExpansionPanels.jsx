import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import CoinExpansionItem from './CoinExpansionItem';

const styles = theme => ({
    root: {
        width: '100%',
    },
});

class CoinExpansionPanel extends Component {
    
    render() {
        const { classes } = this.props;
        const { symbols } = this.props;
        return (
            <div className={classes.root}>
                {symbols.map( item => {
                    return (
                        <CoinExpansionItem key={item.id} coin={item} />
                    )
                })}
            </div>
        );
    }
}

const mapStateToProps = store => ({
        symbols: store.symbols
    })

export default connect(mapStateToProps)(withStyles(styles)(CoinExpansionPanel));