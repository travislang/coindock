import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link, withRouter } from 'react-router-dom';

import HomeIcon from '@material-ui/icons/Home';
import Cast from '@material-ui/icons/CastRounded';
import BrokenImage from '@material-ui/icons/BrokenImage';

import Badge from '@material-ui/core/Badge';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    badge: {
        backgroundColor: theme.palette.secondary.main,
        top: '-7px',
        right: '-9px',
        width: 18,
        height: 18
    },
    small: {
        minHeight: '65px'
    },
});

class MainTabs extends React.Component {
    state = {
        value: 0,
    };

    componentDidMount() {
        // keeps current tab accurate on page refresh
        if (this.props.history.location.pathname === '/') {
            this.setState({
                value: 0
            })
        }
        else if (this.props.history.location.pathname === '/portfolio') {
            this.setState({
                value: 1
            })
        }
        else if (this.props.history.location.pathname === '/alerts') {
            this.setState({
                value: 2
            })
        }
        else if (this.props.history.location.pathname === '/about') {
            this.setState({
                value: false
            })
        }
        else if (this.props.history.location.pathname === '/profile') {
            this.setState({
                value: false
            })
        }
        else if (this.props.history.location.pathname.includes('/new-alert')) {
            this.setState({
                value: 2
            })
        }
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes, user } = this.props;
        console.log('histpry', this.props.history.location);
        
        return (
            <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                className={classes.root}
                indicatorColor="primary"
                textColor='inherit'
                centered
            >
                <Tab className={classes.small} component={Link} to='/home' icon={<HomeIcon />} label="Home" />
                <Tab className={classes.small} component={Link} to='/portfolio' icon={<BrokenImage />} label="Portfolio" />
                <Tab 
                    
                    component={Link} 
                    to='/alerts' 
                    icon={
                        <Badge 
                            max={25} 
                            classes={{ badge: classes.badge }} 
                            badgeContent={user.alerts_total}
                            invisible={user.alerts_total === 0}
                            >
                            <Cast />
                        </Badge>
                        } 
                    label='Alerts' 
                    />
            </Tabs>
        );
    }
}

const mapStateToProps = store => ({
    user: store.user,
})

export default withRouter(connect(mapStateToProps)(withStyles(styles)(MainTabs)));