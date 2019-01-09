import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AutoSelect from '../Autoselect/Autoselect';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Fab from '@material-ui/core/Fab';
import ArrowForward from '@material-ui/icons/ArrowForward';
import SendIcon from '@material-ui/icons/Send';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
    root: {
        width: '100%',
        position: 'relative',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    heading: {
        marginBottom: theme.spacing.unit * 3
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});

function getSteps() {
    return ['Select cryptocurrency', 'Choose price direction', 'Set price level'];
}


class AlertStepper extends Component {
    state = {
        activeStep: 0,
        coinName: '',
        direction: '',
        price: ''
    };

    componentDidMount() {
        const { activeStep } = this.state;
        console.log('this is coinId', this.props.coinId);
        console.log('checkin nan', Number.isNaN(this.props.coinId));
        
        if (this.props.coinId !== 'new') {
            this.setState({
                coinName: this.props.coinId,
                activeStep: 1
            })
        }
        
        
    }

    handleNext = () => {
        const { activeStep } = this.state;
        this.setState({
            activeStep: activeStep + 1,
        });
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    handleRadioChange = event => {
        const { activeStep } = this.state;
        this.setState({
            direction: event.target.value,
            activeStep: activeStep + 1,
        });
    };

    handleSubmit = () => {
        const { enqueueSnackbar } = this.props;
        this.handleReset();
        this.props.dispatch({type: 'ADD_ALERT', payload: {
            coinId: this.state.coinName,
            direction: this.state.direction,
            price: this.state.price
        }})
        enqueueSnackbar(`alert was added`, {
            variant: 'success',
            autoHideDuration: 4000
        })
    }

    // called when user selects item from search form
    handleSelection = (name) => {
        console.log('in handle selection', name);
        this.setState({
            coinName: name.id,
            activeStep: 1
        })
    }

    render() {

        // coinId is passed in as prop
        const { classes, coinId } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;
        console.log('this is state num', this.state.activeStep);
        return (
            <div className={classes.root}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <div className={classes.container}>
                    <Typography align='center' variant="h5" className={classes.heading}>
                        ADD NEW ALERT
                    </Typography>
                    <AutoSelect 
                        message='search for a coin...'
                        handleSelection={this.handleSelection}
                        coinId={coinId}
                    />
                    {activeStep >= 1 && (
                        <div>
                            <FormControl component="fieldset" className={classes.formControl}>
                                <RadioGroup
                                    aria-label="price direction"
                                    name="price direction"
                                    className={classes.group}
                                    value={this.state.direction}
                                    onChange={this.handleRadioChange}
                                >
                                    <FormControlLabel value="true" control={<Radio color="primary" />} label="Less Than" />
                                    <FormControlLabel value='false' control={<Radio color="primary" />} label="More Than" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    )}
                    {activeStep >= 2 && (
                        <div>
                            <TextField
                                id="outlined-number"
                                label="Set Price"
                                value={this.state.age}
                                onChange={this.handleChange('price')}
                                type="number"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText="Enter a price with 2 decimal places"
                                margin="normal"
                                variant="outlined"
                            />
                        </div>
                    )}
                    {activeStep === steps.length - 1 ? (
                        <div>
                            <Fab
                                component={Link}
                                to='/alerts'
                                variant="extended"
                                className={classes.fab}
                                color='primary'
                                onClick={this.handleSubmit}
                            >
                                <SendIcon className={classes.extendedIcon} />
                                Add Alert
                            </Fab>
                        </div>
                    ) : (
                        <div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default connect()(withStyles(styles)(withSnackbar(AlertStepper)));