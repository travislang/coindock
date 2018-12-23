import { Link } from 'react-router-dom';
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
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = theme => ({
    root: {
        flexGrow: 1,
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
    }
});

class MainAppBar extends Component {
    state = {
        auth: true,
        anchorEl: null,
    };

    handleChange = event => {
        this.setState({ auth: event.target.checked });
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes } = this.props;
        const { auth, anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
                <AppBar className={classes.root} color='default' position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <NavLink to="/home" className={classes.grow} style={{ textDecoration: 'none', color: 'unset' }}>
                            <Typography variant="h5" color="inherit" >
                                CoinDock
                            </Typography>
                        </NavLink>
                        <NavLink to='/home' className={classes.navSpacing} style={{ textDecoration: 'none', color: 'unset' }}>
                            <Typography variant="h6" color="inherit" >
                                {this.props.user.id ? 'Home' : 'Login / Register'}
                            </Typography>
                        </NavLink>
                        {this.props.user.id && (
                            <NavLink to="/info" className={classes.navSpacing} style={{ textDecoration: 'none', color: 'unset' }}>
                                <Typography variant="h6" color="inherit" >
                                    Info
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
                                >
                                    <AccountCircle />
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