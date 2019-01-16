import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Chip from '@material-ui/core/Chip';

import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ReorderIcon from '@material-ui/icons/Reorder';
import Hidden from '@material-ui/core/Hidden';

const styles = theme => ({
    "@global": {
        html: {
            [theme.breakpoints.down("md")]: {
                fontSize: 10
            }
        }
    },
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    listItem: {
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    inline: {
        display: 'inline',
        margin: theme.spacing.unit,
    },
    inlineMobile: {
        display: 'inline',
        margin: theme.spacing.unit,
        marginLeft: theme.spacing.unit * 2
    },
    inlineTitle: {
        display: 'inline',
    },
    inlinePrice: {
        display: 'inline',
        margin: theme.spacing.unit,
        color: green[400]
    },
    button: {
        color: 'rgba(255, 255, 255, 0.5)',
        padding: theme.spacing.unit,
        '&:hover': {
            color: theme.palette.error.dark,
        },
    },
    icon: {
        margin: theme.spacing.unit,
        // fontSize: 32,
    },
    centerButtons: {
        display: 'flex',
        alignItems: 'center'
    },
    chip: {
        margin: theme.spacing.unit,
        marginRight: theme.spacing.unit * 2
    },

});

class AlertsListItem extends Component {

    handleToggle = (coinId) => () => {
        this.props.dispatch({ type: 'TOGGLE_COIN_ALERTS', payload: coinId })
    };

    handleDelete = (coinId) => () => {
        this.props.dispatch({type: 'DELETE_ALERT', payload: coinId})
    }

    handleChipDelete = (alertId) => () => {
        this.props.dispatch({type: 'DELETE_CHIP', payload: alertId})
    }

    render() {
        const { classes, coin, user } = this.props;
        const dateChip = <Chip
                            label={`Alert Sent ${coin.alert_sent}`}
                            onDelete={this.handleChipDelete(coin.id)}
                            className={classes.chip}
                            color="default"
                            variant="outlined"
                        />
        return (
            <ListItem className={classes.listItem} disabled={user.global_alerts_on && coin.alerts_on ? false : true} key={coin.id}>
                <ListItemAvatar>
                    <Avatar
                        alt={`cryptocurrency logo`}
                        src={coin.logo}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <React.Fragment>
                            <Typography component="span" className={classes.inlineTitle} variant='h6' color="textPrimary">
                                {coin.symbol_name}
                            </Typography>
                            <Hidden smDown>
                                <Typography component="span" className={classes.inline} color="textSecondary">
                                    {`when 1 ${coin.base_asset} is ${coin.less_than ? 'less than' : 'more than'}`}
                                </Typography>
                            </Hidden>
                            <Hidden smUp>
                                <Typography component="span" className={classes.inlineMobile} 
                                    variant='h5' color="textSecondary">
                                    {`${coin.less_than ? '<' : '>'}`}
                                </Typography>
                            </Hidden>
                            <Typography component="span" className={classes.inlinePrice} variant='h5'>
                                {`$${coin.price_threshold}`}
                            </Typography>
                            
                        </React.Fragment>
                    }
                />
                <ListItemSecondaryAction className={classes.centerButtons}>
                    {coin.alert_sent ? dateChip : null}
                    <IconButton
                        size='small'
                        className={classes.button}
                        onClick={this.handleDelete(coin.id)}
                    >
                        <DeleteIcon fontSize='small' />
                    </IconButton>
                    <Switch
                        checked={user.global_alerts_on && coin.alerts_on}
                        onChange={this.handleToggle(coin.id)}
                        value="alerts on"
                        color="primary"
                    />
                    <div 
                        style={{display: 'inline-block'}}
                        {...this.props.dragHandleProps}>
                        <ReorderIcon
                            className={classes.icon}
                            color="disabled"
                        />
                    </div>
                    
                </ListItemSecondaryAction>
            </ListItem>
        )
    }
}

const mapStateToProps = store => ({
    user: store.user,
    alerts: store.alerts
})

export default connect(mapStateToProps)(withStyles(styles)(AlertsListItem));