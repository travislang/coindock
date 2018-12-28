import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';

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
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: theme.palette.text.primary,
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
})

class SearchBar extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid item xs={11} md={9} lg={7}>
                <Paper className={classes.paper} elevation={3}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Filter Coins..."
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                        />
                    </div>
                </Paper>
            </Grid>
        )
    }
}

export default withStyles(styles)(SearchBar);