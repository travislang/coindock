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
})

class PortfolioSelect extends Component {

    handleAddAlert = () => {
        
    }

    handleDeleteAll = () => {
        
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid item xs={11} md={9} lg={7}>
                <Paper className={classes.paper} elevation={3}>
                    <div className={classNames(classes.column)}>
                    </div>
                    <div className={classNames(classes.title, classes.column)}>
                        <Typography className={classes.titleText} color='textPrimary' variant='overline'>
                            All Portfolio Alerts
                        </Typography>
                    </div>
                    <div className={classNames(classes.column, classes.editButtons)}>
                        <IconButton
                            size='small'
                            className={classes.deleteButton}
                            onClick={this.handleDeleteAll}
                        >
                            <DeleteIcon fontSize='small' />
                        </IconButton>
                        <IconButton
                            size='small'
                            className={classes.button}
                            onClick={this.handleAddAlert}
                        >
                            <AddCircle fontSize='small' />
                        </IconButton>
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