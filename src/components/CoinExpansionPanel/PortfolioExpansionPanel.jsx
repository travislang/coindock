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

const styles = theme => ({
    root: {
        width: '100%',
    },
    summaryRoot: {
        paddingRight: 8,
        
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
        flexBasis: '33%',
        borderRight: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        textAlign: 'center',
        color: theme.palette.textSecondary
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
        let toggle;
        expanded ? toggle = panel : toggle = false;
        this.props.dispatch({ type: 'SET_EXPANDED', payload: toggle })
    };

    addAlert = (coinId) => {

    }

    componentDidMount() {
        this.props.dispatch({ type: 'SET_EXPANDED', payload: false })
    }

    // add coin to active portfolio

    render() {
        const { classes, coin, portfolioSymbols } = this.props;
        const { expanded } = this.props;
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
                    <Typography variant='h4' className={classes.textPrice}>{Number(coin.usd_price).toFixed(2)}</Typography>
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