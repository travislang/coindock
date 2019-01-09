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

import green from '@material-ui/core/colors/green';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ReorderIcon from '@material-ui/icons/Reorder';

const styles = theme => ({
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
    }

});

class AlertsListItem extends Component {

    handleToggle = (coinId) => () => {
        this.props.dispatch({ type: 'TOGGLE_COIN_ALERTS', payload: coinId })
    };

    handleDelete = (coinId) => () => {
        this.props.dispatch({type: 'DELETE_ALERT', payload: coinId})
    }

    render() {
        const { classes, coin, user } = this.props;
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
                            <Typography component="span" className={classes.inline} color="textSecondary">
                                {`when 1 ${coin.base_asset} is ${coin.less_than ? 'less than' : 'more than'}`}
                            </Typography>
                            <Typography component="span" className={classes.inlinePrice} variant='h5'>
                                {`$${coin.price_threshold}`}
                            </Typography>
                        </React.Fragment>
                    }
                />
                <ListItemSecondaryAction className={classes.centerButtons}>
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