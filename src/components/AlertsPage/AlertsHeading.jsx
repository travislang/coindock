import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import AddCircle from '@material-ui/icons/AddCircle';
import Help from '@material-ui/icons/Help';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';

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
    title: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        letterSpacing: '2px',
        fontSize: '1.1rem',
        lineHeight: 1.2
    },
    column: {
        flexBasis: '33%'
    },
    button: {
        color: 'rgba(255, 255, 255, 0.5)',
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
    icon: {
        fontSize: 20,
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        color: 'rgba(255, 255, 255, 0.5)',
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
    deleteButton: {
        color: 'rgba(255, 255, 255, 0.5)',
        '&:hover': {
            color: theme.palette.error.dark,
        },
    },
    editButtons: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    toggleSwitch: {
        display: 'flex',
        justifyContent: 'flex-start'
    },
    buttonAlign: {
        display: 'flex',
        alignItems: 'center'
    },
    dialogText: {
        marginBottom: theme.spacing.unit
    },
})
const infoTooltip = 'This is your alerts page.  CoinDock will automatically monitor the alert prices that you set and send you push notifications when required.  After a notification has been triggered the notification will be turned off.  You can manually turn individual alerts off/off or toggle all alerts at once.'


class AlertsHeading extends Component {
    state = {
        open: false,
    }

    handleAddAlert = () => {
        
    }

    handleDeleteAll = () => {
        const { enqueueSnackbar } = this.props;
        this.props.dispatch({type: 'DELETE_ALL_ALERTS'})
        enqueueSnackbar(`all alerts successfully deleted`, {
            variant: 'success',
            autoHideDuration: 4000
        })
    }

    handleToggle =  () => {
        const { enqueueSnackbar } = this.props;
        const toggle = this.props.user.global_alerts_on ? 'off' : 'on';
        this.props.dispatch({type: 'TOGGLE_ALERTS'})
        enqueueSnackbar(`all alerts turned ${toggle}`, {
            variant: 'warning',
            autoHideDuration: 4000
        })
    };

    handleOpenDialog = () => {
        this.setState({ open: true });
    }

    handleCloseDialog = () => {
        this.setState({ open: false });
    }

    render() {
        const { classes, user } = this.props;
        return (
            <Grid item xs={11} md={9} lg={7}>
                <Paper className={classes.paper} elevation={3}>
                    <div className={classNames(classes.column, classes.toggleSwitch)}>
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={user.global_alerts_on}
                                        onChange={this.handleToggle}
                                        value="alerts on"
                                        color="primary"
                                    />
                                }
                                label="Toggle All Alerts"
                            />
                        </FormGroup>
                    </div>
                    <div className={classNames(classes.title, classes.column)}>
                        <Typography className={classes.titleText} color='textPrimary' variant='overline'>
                            All Portfolio Alerts
                        </Typography>
                    </div>
                    <div className={classNames(classes.column, classes.editButtons, classes.buttonAlign)}>
                        <Tooltip title={'Delete All Alerts'}>
                            <IconButton
                                size='small'
                                className={classes.deleteButton}
                                onClick={this.handleOpenDialog}
                            >
                                <DeleteIcon fontSize='small' />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={'Add Alert'}>
                            <IconButton
                                size='small'
                                component={Link}
                                to='/new-alert/new'
                                className={classes.button}
                                onClick={this.handleAddAlert}
                            >
                                <AddCircle fontSize='small' />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={infoTooltip}>
                            <Help className={classes.icon} />
                        </Tooltip>
                    </div>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleCloseDialog}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">Delete?</DialogTitle>
                        <DialogContent>
                            <DialogContentText className={classes.dialogText}>
                                Are you sure?  This will delete all of your alerts.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCloseDialog} color="default">
                                Cancel
                                </Button>
                            <Button onClick={this.handleDeleteAll} color="primary">
                                Delete
                                </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </Grid>
        )
    }
}

const mapStateToProps = store => ({
    portfolios: store.portfolios,
    user: store.user
})

export default connect(mapStateToProps)(withStyles(styles)(withSnackbar(AlertsHeading)));