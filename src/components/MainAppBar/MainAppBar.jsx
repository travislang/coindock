import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PowerSettings from '@material-ui/icons/PowerSettingsNew';
import TagFaces from '@material-ui/icons/Person';
import Subtitles from '@material-ui/icons/Subtitles';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import MainTabs from './MainTabs';

import LogoIcon from './LogoIcon';

import Hidden from '@material-ui/core/Hidden';

const styles = theme => ({
    root: {
        flexGrow: 1,
        borderTop: `1px solid ${theme.palette.primary.main}`
    },
    grow: {
        flexGrow: 1,
    },
    breakpointGrow: {
        [theme.breakpoints.down('sm')]: {
            flexGrow: 1,
        },
    },
    button: {
        margin: theme.spacing.unit,
        marginRight: 0,
        paddingRight: 0
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
    icon: {
        marginRight: theme.spacing.unit * 2
    },
    toolbar: {
        marginRight: 32,
        marginLeft: 32
    }
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
                    <Toolbar className={classes.toolbar} >
                        {user.id ? <NavLink to="/home" className={classes.breakpointGrow} style={{ textDecoration: 'none', color: 'unset' }}>
                            <LogoIcon />
                            {/* need this to add flex grow to logo if not logged in */}
                        </NavLink> : <NavLink to="/home" className={classes.grow} style={{ textDecoration: 'none', color: 'unset' }}>
                                <LogoIcon />
                            </NavLink>}
                        {user.id ? (
                            <>  <Hidden smDown>
                                    <MainTabs className={classes.grow} />
                                </Hidden>
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
                                    {/* <MenuItem component={Link}
                                    to="/about" onClick={this.handleClose} >About</MenuItem> */}
                                    <MenuItem component={Link}
                                        to="/about" onClick={this.handleClose}>
                                        <Subtitles className={classes.icon} />
                                        About
                                    </MenuItem>
                                    <MenuItem component={Link} 
                                    to="/profile" onClick={this.handleClose}>
                                        <TagFaces className={classes.icon} />
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={this.handleLogout}>
                                        <PowerSettings className={classes.icon} />
                                        Logout
                                    </MenuItem>
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