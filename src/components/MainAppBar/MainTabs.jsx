import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link } from 'react-router-dom';

import HomeIcon from '@material-ui/icons/Home';
import RssFeed from '@material-ui/icons/RssFeed';
import Layers from '@material-ui/icons/Layers';
import BrokenImage from '@material-ui/icons/BrokenImage';


const styles = {
    root: {
        flexGrow: 1,
    },
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
                textColor="'inherit'"
                centered
            >
                <Tab component={Link} to='/home' icon={<HomeIcon />} label="Home" />
        <Tab component={Link} to='/home' icon={<BrokenImage />} label="Portfolio" />
                <Tab component={Link} to='/home' icon={<RssFeed />} label="Alerts" />
            </Tabs>
        );
    }
}

export default withStyles(styles)(MainTabs);