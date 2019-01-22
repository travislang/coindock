import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Link, withRouter } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import HomeIcon from '@material-ui/icons/Home';
import Cast from '@material-ui/icons/CastRounded';
import BrokenImage from '@material-ui/icons/BrokenImage';

import Badge from '@material-ui/core/Badge';

const styles = theme => ({
    root: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: theme.palette.background.default
    },
    badge: {
        backgroundColor: theme.palette.secondary.main,
        top: '-7px',
        right: '-9px',
        width: 18,
        height: 18
    },
});

class BottomNav extends React.Component {
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
        else if (this.props.history.location.pathname.includes('/new-alert')) {
            this.setState({
                value: 2
            })
        }
        else if (this.props.history.location.pathname.includes('/profile')) {
            this.setState({
                value: 5
            })
        }
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes, user } = this.props;
        const { value } = this.state;

        return (
            <BottomNavigation
                value={value}
                onChange={this.handleChange}
                showLabels
                className={classes.root}
            >
                <BottomNavigationAction component={Link} to='/home' label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction component={Link} to='/portfolio' label="Portfolio" icon={<BrokenImage />} />
                <BottomNavigationAction component={Link} to='/alerts' label="Alerts" 
                icon={
                    <Badge
                        max={25}
                        classes={{ badge: classes.badge }}
                        badgeContent={user.alerts_total}
                        invisible={user.alerts_total === 0}
                    >
                        <Cast />
                    </Badge>
                } />
            </BottomNavigation>
        );
    }
}

const mapStateToProps = store => ({
    user: store.user,
})

export default withRouter(connect(mapStateToProps)(withStyles(styles)(BottomNav)));