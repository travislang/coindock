import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link, withRouter } from 'react-router-dom';

import HomeIcon from '@material-ui/icons/Home';
import RssFeed from '@material-ui/icons/RssFeed';
import BrokenImage from '@material-ui/icons/BrokenImage';


const styles = {
    root: {
        flexGrow: 1,
    },
    small: {
        minHeight: '65px'
    }
};

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
        else if (this.props.history.location.pathname === '/new-alert/new') {
            this.setState({
                value: 2
            })
        }
        console.log(this.props.history.location);
        
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes } = this.props;

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
                <Tab className={classes.small} component={Link} to='/alerts' icon={<RssFeed />} label="Alerts" />
            </Tabs>
        );
    }
}

export default withRouter(withStyles(styles)(MainTabs));