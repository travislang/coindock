import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import MainTabs from './MainTabs';

const styles = theme => ({
    root: {
        flexGrow: 1,
        borderTop: `1px solid ${theme.palette.primary.main}`
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    navSpacing: {
        paddingRight: theme.spacing.unit * 2,
    },
    iconButton: {
        padding: theme.spacing.unit / 1.5,
        margin: theme.spacing.unit,
    },
    inline: {
        display: 'inline-block',
    }
});

class MainAppBar extends Component {
    state = {
        auth: true,
        anchorEl: null,
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, user } = this.props;
        const { auth, anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
                <AppBar className={classes.root} color='default' position="static">
                    <Toolbar disableGutters>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <NavLink to="/home" style={{ textDecoration: 'none', color: 'unset' }}>
                            <Typography variant="h5" color="inherit" >
                                CoinDock
                            </Typography>
                        </NavLink>
                        <MainTabs />
                        {/* <NavLink to='/home' className={classes.navSpacing} style={{ textDecoration: 'none', color: 'unset' }}>
                            <Typography variant="h6" color="inherit" >
                                {user.id ? 'Home' : 'Login / Register'}
                            </Typography>
                        </NavLink>
                        <NavLink to="/info" className={classes.navSpacing} style={{ textDecoration: 'none', color: 'unset' }}>
                            <Typography variant="h6" color="inherit" >
                                Info
                                </Typography>
                        </NavLink> */}
                        {user.id && (
                            <NavLink to='/' style={{ textDecoration: 'none', color: 'unset' }}>
                                <Typography className={classes.inline} variant="h6" color="inherit" >
                                    Welcome, {user.name}
                                </Typography>
                            </NavLink>
                        )}
                        {auth && (
                            <div>
                                <IconButton
                                    aria-owns={open ? 'menu-appbar' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                    className={classes.iconButton}
                                >
                                    {user.facebook_image !== 'none' ? <Avatar alt="user profile image" src={user.facebook_image} /> : <AccountCircle />}
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                    <NavLink to="/about" style={{ textDecoration: 'none', color: 'unset', outline: 'none' }}>
                                        <MenuItem onClick={this.handleClose}>About</MenuItem>
                                    </NavLink>
                                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(MainAppBar));