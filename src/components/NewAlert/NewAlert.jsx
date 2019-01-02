import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AlertStepper from './AlertStepper';

const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '85vh',
    },
    rootContainer: {
        marginTop: theme.spacing.unit * 5,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    center: {
        display: 'flex',
        justifyContent: 'center'
    }
    
});

class NewAlert extends Component {
    state = {
        name: '',
        password: '',
    };



    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container justify='center' alignItems='center' className={classes.rootContainer} >
                    <Grid item xs={12} sm={10} md={9} lg={7}>
                        <Paper className={classes.paper} elevation={5}>
                            <AlertStepper />
                            
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    errors: state.errors,
});

export default connect(mapStateToProps)(withStyles(styles)(NewAlert));