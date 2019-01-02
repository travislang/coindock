import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import green from '@material-ui/core/colors/green';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
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
    }
});

class AlertsList extends Component {
    state = {
        checked: [1],
    };

    componentDidMount() {
        this.props.dispatch({type: 'FETCH_ALERTS'})
    }

    handleToggle = value => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };

    render() {
        const { classes, alerts } = this.props;
        
        return (
            <List dense className={classes.root}>
                {alerts.map(item => (
                    <ListItem key={item.id} button>
                        <ListItemAvatar>
                            <Avatar
                                alt={`cryptocurrency logo`}
                                src={item.logo}
                            />
                        </ListItemAvatar>
                        <ListItemText 
                            primary={
                                <React.Fragment>
                                    <Typography component="span" className={classes.inlineTitle} variant='h6' color="textPrimary">
                                        {item.symbol_name}
                                    </Typography>
                                    <Typography component="span" className={classes.inline} color="textSecondary">
                                        {`when 1 ${item.base_asset} is ${item.less_than ? 'less than' : 'more than'}`}
                                    </Typography>
                                    <Typography component="span" className={classes.inlinePrice} variant='h5'>
                                        {`$${item.price_threshold}`}
                                    </Typography>
                                </React.Fragment>
                            }
                         />
                        <ListItemSecondaryAction>
                            <Checkbox
                                onChange={this.handleToggle(item.id)}
                                checked={this.state.checked.indexOf(item.id) !== -1}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        );
    }
}

const mapStateToProps = store => ({
    alerts: store.alerts
})

export default connect(mapStateToProps)(withStyles(styles)(AlertsList));