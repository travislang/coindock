import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';

import SnackbarContent from '@material-ui/core/SnackbarContent';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
};

const styles = theme => ({
    success: {
        backgroundColor: green[600],
    },
    warning: {
        backgroundColor: amber[700],
    },
    close: {
        padding: theme.spacing.unit / 2,
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

class AlertSnackbar extends Component {

    handleClose = (event, reason) => {
        this.props.handleClose();
    };

    render() {
        const { classes, message, variant, name } = this.props;
        const Icon = variantIcon[variant];
        const messageToShow = `${name} ${message}`;
        return (
            <div>
                <SnackbarContent
                    className={classNames(classes[variant])}
                    ContentProps={{
                        'aria-describedby': 'client-snackbar',
                    }}
                    message={
                        <span id="client-snackbar" className={classes.message}>
                            <Icon className={classNames(classes.icon, classes.iconVariant)} />
                            {messageToShow}
                        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </div>
        );
    }
}

export default withStyles(styles)(AlertSnackbar);