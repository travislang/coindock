import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import AlertListItem from './AlertListItem';

import green from '@material-ui/core/colors/green';





const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});

class AlertsList extends Component {

    componentDidMount() {
        this.props.dispatch({type: 'FETCH_ALERTS'})
    }

    render() {
        const { classes, alerts } = this.props;
        return (
            <List dense className={classes.root}>
                {alerts.map(item => (
                    <AlertListItem coin={item} />
                ))}
            </List>
        );
    }
}

const mapStateToProps = store => ({
    user: store.user,
    alerts: store.alerts
})

export default connect(mapStateToProps)(withStyles(styles)(AlertsList));