import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import SocketContext from '../SocketContext';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import DeleteIcon from '@material-ui/icons/Delete';
import AddCircle from '@material-ui/icons/AddCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withSnackbar } from 'notistack';

// dialog dependencies
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
    paper: {
        padding: theme.spacing.unit,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginTop: theme.spacing.unit * 2,
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center'
    },
    search: {
        position: 'relative',
        borderRadius: '25px',
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        width: '100%',
        [theme.breakpoints.up('md')]: {
            marginLeft: theme.spacing.unit * 5,
            marginRight: theme.spacing.unit * 5,
            width: '50%',
        },
    },
    title: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        // border: `1px solid ${theme.palette.primary.dark}`,
        // borderRadius: '30px'
    },
    titleText: {
        letterSpacing: '2px',
        fontSize: '1.2rem',
        lineHeight: 1.5
    },
    column: {
        flexBasis: '33%'
    },
    button: {
        color: 'rgba(255, 255, 255, 0.5)',
        padding: theme.spacing.unit,
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
    deleteButton: {
        color: 'rgba(255, 255, 255, 0.5)',
        padding: theme.spacing.unit,
        '&:hover': {
            color: theme.palette.error.dark,
        },
    },
    editButtons: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    updatedTime: {
        color: theme.palette.text.disabled
    },
    dialogText: {
        marginBottom: theme.spacing.unit
    },
    selectButton: {
        color: 'rgba(255, 255, 255, 0.5)',
        padding: theme.spacing.unit / 2
    }
})

class PortfolioSelect extends Component {

    state = {
        open: false,
        openDeleteDialog: false,
        anchorEl: null,
        anchorElSettings: null,
        newPortfolio: ''
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    handleClickSettings = event => {
        this.setState({ anchorElSettings: event.currentTarget });
    };

    handleClose = (item) => {
        const socket = this.context;
        const currentPortfolio = this.props.portfolios.activePortfolio && this.props.portfolios.activePortfolio[0];
        console.log('current portfolio', currentPortfolio);
        
        this.setState({ anchorEl: null });
        // check to make sure user closed menu by clicking a portfolio item
        if (Number(item.id) && (currentPortfolio && currentPortfolio.id) != item.id ) {
            this.props.dispatch({ type: 'SET_LOADING_TRUE' })
            this.props.dispatch({ type: 'SET_ACTIVE', payload: {data: { data: item.id }, socket: socket}})
            // close current socket stream and start new one with updated symbols
            socket.emit('closePortfolioWs');
        }
    };

    // dialog state management functions
    handleOpenDialog = () => {
        this.setState({ open: true });
    }
    handleDeleteOpenDialog = () => {
        this.setState({ openDeleteDialog: true });
    }
    handleCloseDialog = () => {
        this.setState({ open: false });
    }
    handleCloseDeleteDialog = () => {
        this.setState({ openDeleteDialog: false });
    }
    handleNewPortfolio = (e) => {
        this.setState({
            newPortfolio: e.target.value
        })
    }

    // add new portfolio 
    handleAdd = () => {
        const socket = this.context;
        this.props.dispatch({ type: 'SET_LOADING_TRUE' })
        this.props.dispatch({type: 'ADD_PORTFOLIO', payload: {name: {data: this.state.newPortfolio}, socket: socket}})
        this.handleCloseDialog();
        this.setState({
            newPortfolio: ''
        })
        this.props.enqueueSnackbar(`added new portfolio`, {
            variant: 'success',
            autoHideDuration: 5000
        })
    }

    handleDeleteDialog = () => {
        // close dialog
        this.handleCloseDeleteDialog();
        // delete portfolio
        this.handleDelete();
    }
    // delete portfolio from db
    handleDelete = () => {
        const socket = this.context;
        this.props.dispatch({ type: 'SET_LOADING_TRUE' })
        // find next portfolio user has that isnt active
        let portfolioToMakeActive = this.props.portfolios.portfolios.find(item => {
            return item.active === false;
        })
        this.props.dispatch({
            type: 'DELETE_PORTFOLIO',
            payload: {
                portfolioId: this.props.portfolios.activePortfolio[0].id,
                portfolioToMakeActive: portfolioToMakeActive.id,
                socket: socket
            }
        })
        this.props.enqueueSnackbar(`portfolio ${this.props.portfolios.activePortfolio[0].portfolio_name} deleted`, {
            variant: 'success',
            autoHideDuration: 5000
        })
    }

    render() {
        const { classes, portfolios } = this.props;
        const { anchorEl } = this.state;
        return (
            <Grid item xs={11} md={9} lg={7}>
                <Paper className={classes.paper} elevation={3}>
                    <div className={classNames(classes.column)}>
                        <Typography className={classes.updatedTime} variant='caption' align='left' color='secondary'>
                            Portfolio updated:
                        </Typography>
                        <Typography variant='caption' align='left' color='primary'>
                            a few seconds ago
                        </Typography>
                    </div>
                    <div className={classNames(classes.title, classes.column)}>
                        <Typography className={classes.titleText} color='textPrimary' variant='overline'>
                            {portfolios.activePortfolio && portfolios.activePortfolio[0] && portfolios.activePortfolio[0].portfolio_name || 'No Portfolio Selected'}
                        </Typography>
                        <Tooltip disableFocusListener={true} title="Switch Portfolio" aria-label="Switch Portfolio">
                            <IconButton
                                size='small'
                                className={classes.selectButton}
                                aria-owns={anchorEl ? 'simple-menu' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleClick}
                            >
                                <ArrowDropDown  />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this.handleClose}
                        >
                            {portfolios.portfolios && portfolios.portfolios.map(item => {
                                return (
                                    <MenuItem key={item.id} onClick={() => this.handleClose(item)}>{item.portfolio_name}</MenuItem>
                                )
                            })}
                        </Menu>
                    </div>
                    <div className={classNames(classes.column, classes.editButtons)}>
                        <Tooltip disableFocusListener title="Delete Portfolio" aria-label="Delete Portfolio">
                            <IconButton
                                size='small'
                                className={classes.deleteButton}
                                aria-owns={anchorEl ? 'simple-menu' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleDeleteOpenDialog}
                            >
                                <DeleteIcon fontSize='small' />
                            </IconButton>
                        </Tooltip>
                        <Tooltip disableFocusListener={true} title="New Portfolio" aria-label="New Portfolio">
                            <IconButton
                                size='small'
                                className={classes.button}
                                aria-owns={anchorEl ? 'simple-menu' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleOpenDialog}
                            >
                                <AddCircle fontSize='small' />
                            </IconButton>
                        </Tooltip>
                        <Dialog
                            className={classes.dialog}
                            open={this.state.open}
                            onClose={this.handleCloseDialog}
                            aria-labelledby="form-dialog-title"
                        >
                            <DialogTitle id="form-dialog-title">Add New Portfolio</DialogTitle>
                            <DialogContent>
                                <DialogContentText className={classes.dialogText}>
                                    Please enter a new portfolio name. Example: 'Ethereum based tokens'
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    id="name"
                                    label="Portfolio Name"
                                    type="text"
                                    value={this.state.newPortfolio}
                                    onChange={this.handleNewPortfolio}
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleCloseDialog} color="default">
                                    Cancel
                                </Button>
                                <Button onClick={this.handleAdd} color="primary">
                                    Add
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            className={classes.dialog}
                            open={this.state.openDeleteDialog}
                            onClose={this.handleCloseDeleteDialog}
                            aria-labelledby="form-dialog-title"
                        >
                            <DialogTitle id="form-dialog-title">Delete?</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to remove this cryptocurrency?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleCloseDeleteDialog} color="default">
                                    Cancel
                                </Button>
                                <Button onClick={this.handleDeleteDialog} color="primary">
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Paper>
            </Grid>
        )
    }
}

//getting socket instance context
PortfolioSelect.contextType = SocketContext;

const mapStateToProps = store => ({
    portfolios: store.portfolios,
    portfolioSymbols: store.portfolioSymbols
})

export default connect(mapStateToProps)(withStyles(styles)(withSnackbar(PortfolioSelect)));