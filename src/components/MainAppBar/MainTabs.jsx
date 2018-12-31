import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link } from 'react-router-dom';

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
                <Tab className={classes.small} component={Link} to='/home' icon={<RssFeed />} label="Alerts" />
            </Tabs>
        );
    }
}

export default withStyles(styles)(MainTabs);