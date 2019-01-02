import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';

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
});

function getSteps() {
    return ['Select cryptocurrency', 'Choose price direction', 'Set price level'];
}


class AlertStepper extends Component {
    state = {
        activeStep: 0,
        direction: '',
        price: ''
    };

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

    handleRadioChange = event => {
        this.setState({ direction: event.target.value });
    };

    handleChange = name => e => {
        this.setState({
            [name]: e.target.value
        })
    }

    handleSubmit = () => {
        this.handleReset();

    }

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;

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
                <div>
                    <Typography align='center' variant="h5" gutterBottom>
                        ADD NEW ALERT
                            </Typography>
                    <TextField
                        id="standard-name"
                        label="Cryptocurrency"
                        className={classes.textField}
                        value={this.state.name}
                        
                        placeholder='Pick a coin'
                        margin="normal"
                        autoFocus
                        InputLabelProps={{
                            shrink: true,
                        }}
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
                                    <FormControlLabel value="down" control={<Radio color="primary" />} label="Less Than" />
                                    <FormControlLabel value="up" control={<Radio color="primary" />} label="More Than" />
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
                                className={classes.fab}
                                color='primary'
                                onClick={this.handleSubmit}
                            >
                                <SendIcon />
                            </Fab>
                        </div>
                    ) : (
                        <div>
                            <Fab 
                                className={classes.fab} 
                                color='primary'
                                onClick={this.handleNext}
                                >
                                <ArrowForward />
                            </Fab>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(AlertStepper);