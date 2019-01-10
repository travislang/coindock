import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import HomeIcon from '@material-ui/icons/Home';
import RssFeed from '@material-ui/icons/RssFeed';
import BrokenImage from '@material-ui/icons/BrokenImage';

const styles = {
    root: {
        flexGrow: 1,
    },
};

class BottomNav extends React.Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <BottomNavigation
                value={value}
                onChange={this.handleChange}
                showLabels
                className={classes.root}
            >
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Portfolio" icon={<BrokenImage />} />
                <BottomNavigationAction label="Alerts" icon={<RssFeed />} />
            </BottomNavigation>
        );
    }
}

export default withStyles(styles)(BottomNav);