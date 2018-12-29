import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 250,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
})

class PortfolioSelect extends Component {

    state = {
        portfolio: 'none',
        labelWidth: 0,
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
        this.props.dispatch({ type: 'FETCH_PORTFOLIO_SYMBOLS', payload: event.target.value})
    };

    componentDidMount() {
        console.log(this.props.portfolios);
        
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
            portfolio: this.props.portfolios.length > 0 ? this.props.portfolios[0].id : 'none'
        });
        
        
    }

    render() {
        const { classes, portfolios } = this.props;
        return (
            <Grid item xs={11} md={9} lg={7}>
                <Paper className={classes.paper} elevation={3}>
                    <FormControl margin='dense' variant="outlined" className={classes.formControl}>
                        <InputLabel
                            ref={ref => {
                                this.InputLabelRef = ref;
                            }}
                            htmlFor="portfolio-select"
                        >
                            Current Portfolio
                        </InputLabel>
                        <Select
                            native
                            value={this.state.portfolio}
                            onChange={this.handleChange('portfolio')}
                            input={
                                <OutlinedInput
                                    autoFocus
                                    name="portfolio"
                                    labelWidth={this.state.labelWidth}
                                    id="portfolio-select"
                                />
                            }
                        >
                            {portfolios.map( item => {
                                return (
                                    <option key={item.id} value={item.id}>{item.portfolio_name}</option>
                                )
                            })}
                            <option value="none">Select One</option>
                        </Select>
                    </FormControl>
                </Paper>
            </Grid>
        )
    }
}

const mapStateToProps = store => ({
    portfolios: store.portfolios,
})

export default connect(mapStateToProps)(withStyles(styles)(PortfolioSelect));