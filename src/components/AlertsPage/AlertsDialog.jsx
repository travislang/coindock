import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function AlertsDialog (props) {
    return (
      <div>
        <Dialog
          open={props.open}
          onClose={props.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
            {"Allow Push Notifications?"}
        </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This app uses push notifications to send users alerts.  Without allowing notifications the alert functionality will not work.  Please click agree and then click allow when your browser asks you for permission to send notifications.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleClose} color="primary">
              Disagree
            </Button>
            <Button onClick={props.handleAccept} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

export default AlertsDialog;