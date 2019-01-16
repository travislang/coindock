import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ReorderIcon from '@material-ui/icons/Reorder';

import Chip from '@material-ui/core/Chip';
import DoneAll from '@material-ui/icons/DoneAll';
import AddIcon from '@material-ui/icons/Add';
import TapAndPlay from '@material-ui/icons/TapAndPlay';
import DeleteIcon from '@material-ui/icons/Delete';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import LineChart from '../LineChart/LineChart';
import CountUp from 'react-countup';

const styles = theme => ({
    root: {
        width: '100%',
    },
    summaryRoot: {
        paddingRight: 8,
        borderBottom: `1px solid rgba(0, 0, 0, 0.25)`
    },
    heading: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center'
    },
    textName: {
        fontSize: theme.typography.pxToRem(20)
    },
    textPrice: {
        paddingRight: theme.spacing.unit * 2,
    },
    countup: {
        ...theme.typography.h4,
        paddingRight: theme.spacing.unit * 2,
    },
    textPercentPos: {
        paddingRight: 25,
        paddingLeft: 10,
        color: green[400],
        marginRight: theme.spacing.unit * 2,
    },
    textPercentNeg: {
        paddingRight: 25,
        paddingLeft: 10,
        color: red[400],
        marginRight: theme.spacing.unit * 2,
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flexBasis: '33%',
        borderRight: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        textAlign: 'center',
        color: theme.palette.textSecondary
    },
    columnRight: {
        flexBasis: '40%',
        padding: `${theme.spacing.unit}px 0 0 ${theme.spacing.unit * 2}px`,
    },
    avatar: {
        marginRight: 10,
        width: 30,
        height: 30,
    },
    button: {
        marginRight: theme.spacing.unit * 2,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    chip: {
        marginLeft: theme.spacing.unit * 2,
    },
    expandIcon: {
        marginRight: theme.spacing.unit * 4
    },
    icon: {
        margin: theme.spacing.unit,
    },
});

class PortfolioExpansionPanel extends Component {
    state = {
        expanded: null,
    };

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    deleteCoin = (coinId, portfolioId) => {
        this.props.dispatch({type: 'DELETE_PORTFOLIO_COIN', payload: {coinId: coinId, portfolioId: portfolioId}})
    }


    render() {
        const { classes, coin, portfolioSymbols } = this.props;
        const { expanded } = this.state;
        const alertUrl = `/new-alert/${coin.id}`;
        
        // let addedChip = '';
        // if (portfolioSymbols.length > 0) {
        //     let match = portfolioSymbols.filter(item => {
        //         return item.id === coin.id
        //     })
        //     if (match.length === 1) {
        //         addedChip = (<Chip
        //             icon={<DoneAll />}
        //             label="Added to Portfolio"
        //             className={classes.chip}
        //             variant="outlined"
        //         />)
        //     }
        // }
        return (
            <ExpansionPanel expanded={expanded === coin.id} onChange={this.handleChange(coin.id)}>
                <ExpansionPanelSummary classes={{ expandIcon: classes.expandIcon, root: classes.summaryRoot}} expandIcon={<ExpandMoreIcon color='disabled' />}>
                    <div className={classes.heading}>
                        <Avatar alt="crypto logo" src={coin.logo} className={classes.avatar} />
                        <Typography className={classes.textName}>
                            {coin.symbol_name}
                        </Typography>
                        {/* {addedChip} */}
                    </div>
                    <CountUp 
                        start={Number(coin.previous_price)} 
                        end={Number(coin.usd_price)} 
                        delay={0}
                        decimals={2}
                        prefix={'$'}
                    >
                        {({ countUpRef }) => (
                            <div className={classes.countup}>
                                <span ref={countUpRef} />
                            </div>
                        )}
                    </CountUp>
                    {/* <Typography variant='h4' className={classes.textPrice}>{Number(coin.usd_price).toFixed(2)}</Typography> */}
                    <Typography variant='overline' className={coin.price_change > 0 ? classes.textPercentPos : classes.textPercentNeg}>{Number(coin.price_change).toFixed(2)}%</Typography>
                    <div
                        style={{ display: 'flex', alignItems: 'center', paddingRight: 0 }}
                        {...this.props.dragHandleProps}>
                        <ReorderIcon
                            className={classes.icon}
                            color="disabled"
                        />
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className={classes.column}>
                        <Typography variant='h5'>
                            ${coin.high ? Number(coin.high).toFixed(4) : 'Loading...'}
                        </Typography>
                        <Typography color='textSecondary' variant='overline'>
                            24 Hour High
                            </Typography>
                    </div>
                    <div className={classes.column}>
                        <Typography variant='h5'>
                            ${coin.low ? Number(coin.low).toFixed(4) : 'Loading...'}
                            </Typography>
                        <Typography color='textSecondary' variant='overline'>
                            24 Hour Low
                            </Typography>
                    </div>
                    <div className={classes.columnRight}>
                        <LineChart klines={coin.kline} />
                    </div>
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                    <Button onClick={() => this.deleteCoin(coin.id, coin.portfolio_id)} variant="contained" color="primary" className={classes.button}>
                        <DeleteIcon className={classes.leftIcon} />
                        Remove
                    </Button>
                    <Button component={Link} to={alertUrl} variant="contained" color="primary" className={classes.button}>
                        <TapAndPlay className={classes.leftIcon} />
                        Set Alert
                    </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        )
    }
}

const mapStateToProps = store => ({
    expanded: store.expanded,
    portfolioSymbols: store.portfolioSymbols,
    portfolios: store.portfolios
})

export default connect(mapStateToProps)(withStyles(styles)(PortfolioExpansionPanel))