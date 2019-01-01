import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import AddCircle from '@material-ui/icons/AddCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import LayersIcon from '@material-ui/icons/LayersOutlined';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { fade } from '@material-ui/core/styles/colorManipulator';

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
        border: `1px solid ${theme.palette.primary.dark}`,
        borderRadius: '30px'
    },
    titleText: {
        letterSpacing: '2px',
        fontSize: '1rem',
        lineHeight: 'normal'
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
    layerIcon: {
        marginRight: theme.spacing.unit * 2
    },
})

class PortfolioSelect extends Component {

    state = {
        open: false,
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

    handleClose = (id) => {
        console.log('click menu id', id);
        this.setState({ anchorEl: null });
        // check to make sure user closed menu by clicking a portfolio item
        if (Number(id)) {
            this.props.dispatch({ type: 'SET_ACTIVE', payload: { data: id } })
        }
    };

    handleOpenDialog = () => {
        this.setState({ open: true });
    }

    handleCloseDialog = () => {
        this.setState({ open: false });
    }

    handleNewPortfolio = (e) => {
        this.setState({
            newPortfolio: e.target.value
        })
    }

    handleAdd = () => {
        this.props.dispatch({type: 'ADD_PORTFOLIO', payload: {data: this.state.newPortfolio}})
        this.handleCloseDialog();
        this.setState({
            newPortfolio: ''
        })
        
    }

    handleDelete = () => {
        // find next portfolio user has that isnt active
        let portfolioToMakeActive = this.props.portfolios.portfolios.find(item => {
            return item.active === false;
        })
        this.props.dispatch({
            type: 'DELETE_PORTFOLIO',
            payload: {
                portfolioId: this.props.portfolios.activePortfolio[0].id,
                portfolioToMakeActive: portfolioToMakeActive.id
            }
        })
    }

    render() {
        const { classes, portfolios } = this.props;
        const { anchorEl } = this.state;
        return (
            <Grid item xs={11} md={9} lg={7}>
                <Paper className={classes.paper} elevation={3}>
                    <div className={classNames(classes.column)}>
                    </div>
                    <div className={classNames(classes.title, classes.column)}>
                        <Typography className={classes.titleText} color='textPrimary' variant='overline'>
                            {portfolios.activePortfolio && portfolios.activePortfolio[0] && portfolios.activePortfolio[0].portfolio_name || 'No Portfolio Selected'}
                        </Typography>
                    </div>
                    <div className={classNames(classes.column, classes.editButtons)}>
                        <IconButton
                            size='small'
                            className={classes.button}
                            aria-owns={anchorEl ? 'simple-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                        >
                            <SettingsIcon fontSize='small' />
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this.handleClose}
                        >
                            {portfolios.portfolios && portfolios.portfolios.map(item => {
                                return (
                                    <MenuItem key={item.id} onClick={() => this.handleClose(item.id)}>{item.portfolio_name}</MenuItem>
                                )
                            })}
                        </Menu>
                        <IconButton
                            size='small'
                            className={classes.deleteButton}
                            aria-owns={anchorEl ? 'simple-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleDelete}
                        >
                            <DeleteIcon fontSize='small' />
                        </IconButton>
                        <IconButton
                            size='small'
                            className={classes.button}
                            aria-owns={anchorEl ? 'simple-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleOpenDialog}
                        >
                            <AddCircle fontSize='small' />
                        </IconButton>
                        <Dialog
                            open={this.state.open}
                            onClose={this.handleCloseDialog}
                            aria-labelledby="form-dialog-title"
                        >
                            <DialogTitle id="form-dialog-title">Add New Portfolio</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
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
                    </div>
                </Paper>
            </Grid>
        )
    }
}

const mapStateToProps = store => ({
    portfolios: store.portfolios,
})

export default connect(mapStateToProps)(withStyles(styles)(PortfolioSelect));