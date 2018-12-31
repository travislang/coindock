import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import MainTabs from './MainTabs';

import LogoIcon from './LogoIcon';

const styles = theme => ({
    root: {
        flexGrow: 1,
        borderTop: `1px solid ${theme.palette.primary.main}`
    },
    grow: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing.unit,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    navSpacing: {
        paddingRight: theme.spacing.unit * 2,
    },
    iconButton: {
        padding: theme.spacing.unit / 1.72,
        margin: theme.spacing.unit,
    },
    avatar: {
        marginRight: theme.spacing.unit * 1.5,
    },
    inline: {
        display: 'inline-block',
    },
    logo: {
        fontWeight: theme.typography.fontWeightLight,
        letterSpacing: '0.1em',
        fontSize: "1.5rem",
        lineHeight: '1.33',
        display: 'inline-block',
    },
    rightIcon: {
        marginLeft: theme.spacing.unit / 2,
        color: theme.palette.text.disabled,
    },
});

class MainAppBar extends Component {
    state = {
        anchorEl: null,
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleLogout = () => {
        this.setState({ anchorEl: null });
        this.props.dispatch({ type: 'LOGOUT' })
    };

    render() {
        const { classes, user } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        return (
            <div className={classes.root}>
                <AppBar color='default' position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        {user.id ? <NavLink to="/home" style={{ textDecoration: 'none', color: 'unset' }}>
                            <LogoIcon />
                            {/* need this to add flex grow to logo if not logged in */}
                        </NavLink> : <NavLink to="/home" className={classes.grow} style={{ textDecoration: 'none', color: 'unset' }}>
                                <LogoIcon />
                            </NavLink>}
                        {user.id ? (
                            <>
                                <MainTabs className={classes.grow}/>
                                <Button  
                                    size='small' 
                                    aria-owns={open ? 'menu-appbar' : undefined}
                                    onClick={this.handleMenu}
                                    color="default" 
                                    className={classes.button}
                                >
                                    {user.facebook_image !== 'none' ? <Avatar className={classes.avatar} alt="user profile image" src={user.facebook_image} /> : <AccountCircle />}
                                    {user.name}
                                    <ExpandMoreIcon className={classes.rightIcon} />
                                </Button>
                                <Menu
                                    getContentAnchorEl={null}
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem component={Link}
                                    to="/about" onClick={this.handleClose} >About</MenuItem>
                                    <MenuItem component={Link} 
                                    to="/profile" onClick={this.handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : <Button 
                                component={Link}
                                to='/home'
                                focusRipple
                                color="primary" 
                                className={classes.button}
                            >
                                Login
                            </Button> }
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