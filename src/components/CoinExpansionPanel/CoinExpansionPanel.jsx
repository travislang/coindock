import React, { Component } from 'react';
import { connect } from 'react-redux';

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

import Chip from '@material-ui/core/Chip';
import DoneAll from '@material-ui/icons/DoneAll';
import AddIcon from '@material-ui/icons/Add';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import LineChart from '../LineChart/LineChart';

const styles = theme => ({
    root: {
        width: '100%',
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
        color: green[400],
        marginRight: theme.spacing.unit * 2,
    },
    textPercentNeg: {
        color: red[400],
        marginRight: theme.spacing.unit * 2,
    },
    column: {
        flexBasis: '30%',
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
        color: theme.palette.text.disabled,
        marginLeft: theme.spacing.unit * 2,
    },
    chipIcon: {
        color: theme.palette.text.disabled,
    }
});

class CoinExpansionPanel extends Component {
    state = {
        expanded: null,
    };

    componentDidMount() {
        this.props.dispatch({ type: 'SET_EXPANDED', payload: false })
    }

    handleChange = panel => (event, expanded) => {
        let toggle;
        expanded ? toggle = panel : toggle = false;
        this.props.dispatch({type: 'SET_EXPANDED', payload: toggle})
    };

    // add coin to active portfolio
    addCoin = ({id, symbol_name}) => {
        this.props.dispatch({
            type: 'ADD_COIN',
            payload: {
                portfolio: this.props.portfolios.activePortfolio[0].id,
                coin: id
            }
        })
        this.props.snackbarControl(symbol_name);
    }

    render() {
        const { classes, coin, portfolioSymbols } = this.props;
        const { expanded } = this.props;
        let addedChip = '';
        if (portfolioSymbols.length > 0) {
            let match = portfolioSymbols.filter( item => {
                return item.id === coin.id
            })
            if (match.length === 1) {
                addedChip = (<Chip
                    key={match.id}
                    icon={<DoneAll className={classes.chipIcon} />}
                    label="Added to Portfolio"
                    className={classes.chip}
                    variant="outlined"
                />)
            }
        }
        return (
            <ExpansionPanel expanded={expanded === coin.id} onChange={this.handleChange(coin.id)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon color='disabled' />}>
                    <div className={classes.heading}>
                        <Avatar alt="crypto logo" src={coin.logo} className={classes.avatar} />
                        <Typography className={classes.textName}>
                            {coin.symbol_name}
                        </Typography>
                        {addedChip}
                    </div>
                    <Typography variant='h4' className={classes.textPrice}>${Number(coin.usd_price).toFixed(2)}</Typography>
                    <Typography variant='overline' className={coin.price_change > 0 ? classes.textPercentPos : classes.textPercentNeg}>{Number(coin.price_change).toFixed(2)}%</Typography>
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
                    <div className={classes.columnRight}>
                        {/* <LineChart /> */}
                    </div>
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                    <Button onClick={() => this.addCoin(coin)} variant="contained" color="primary" className={classes.button}>
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
    portfolioSymbols: store.portfolioSymbols,
    portfolios: store.portfolios
})

export default connect(mapStateToProps)(withStyles(styles)(CoinExpansionPanel));


