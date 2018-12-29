import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import AddIcon from '@material-ui/icons/Add';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        flexGrow: 1,
        display: 'flex'
    },
    textName: {
        fontSize: theme.typography.pxToRem(20)
    },
    textPrice: {
        paddingRight: theme.spacing.unit * 2,
        
    },
    textPercent: {
        color: green[400],
        marginRight: theme.spacing.unit * 2,
    },
    column: {
        flexBasis: '30%',
        borderRight: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        textAlign: 'center',
        color: theme.palette.textSecondary
    },
    avatar: {
        padding: 5,
        marginRight: 10,
        width: 30,
        height: 30,
        backgroundColor: theme.palette.grey[300]
    },
    button: {
        marginRight: theme.spacing.unit * 2,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
});

class CoinExpansionItem extends Component {
    state = {
        expanded: null,
    };

    handleChange = panel => (event, expanded) => {
        let toggle;
        expanded ? toggle = panel : toggle = false;
        this.props.dispatch({type: 'SET_EXPANDED', payload: toggle})
    };

    addCoin = name => {
        console.log('this is id', name)
    }

    render() {
        const { classes, coin } = this.props;
        const { expanded } = this.props;
        
        return (
            <ExpansionPanel expanded={expanded === coin.id} onChange={this.handleChange(coin.id)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div className={classes.heading}>
                        <Avatar alt="crypto logo" src={coin.logo} className={classes.avatar} />
                        <Typography className={classes.textName}>
                            {coin.symbol_name}
                        </Typography>
                    </div>
                    <Typography variant='h4' className={classes.textPrice}>{Number(coin.last_price).toFixed(2)}</Typography>
                    <Typography variant='overline' className={classes.textPercent}>{Number(coin.price_change).toFixed(2)}%</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className={classes.column}>
                        <Typography variant='h5'>
                            {coin.volume}
                            </Typography>
                        <Typography color='textSecondary' variant='overline'>
                            24 Hour Volume
                            </Typography>
                    </div>
                    <div className={classes.column}>
                        <Typography variant='h5'>
                            $58,690,281
                            </Typography>
                        <Typography color='textSecondary' variant='overline'>
                            Market Cap
                            </Typography>
                    </div>
                    <div className={classes.column}>
                        
                    </div>
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                    <Button onClick={() => this.addCoin(coin.id)} variant="contained" color="primary" className={classes.button}>
                        <AddIcon className={classes.leftIcon} />
                        Add
                        </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        )
    }
}

const mapStateToProps = store => ({
    expanded: store.expanded,
})

export default connect(mapStateToProps)(withStyles(styles)(CoinExpansionItem));


