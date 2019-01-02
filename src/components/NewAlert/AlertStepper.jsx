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

const styles = theme => ({
    root: {
        width: '100%',
        marginBottom: theme.spacing.unit * 3
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
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
});

function getSteps() {
    return ['Select cryptocurrency', 'Choose price direction', 'Set price level'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return 'Select cryptocurrency';
        case 1:
            return 'Choose price direction';
        case 2:
            return 'Set price level';
        default:
            return 'Unknown step';
    }
}

class AlertStepper extends Component {
    state = {
        activeStep: 1,
        direction: ''
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
        this.setState({
            activeStep: 2,
        });
    };

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;

        return (
            <div className={classes.root}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const props = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...props}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
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
                    {activeStep === 1 ? (
                        <div>
                            <FormControl component="fieldset" className={classes.formControl}>
                                <FormLabel component="legend">Price direction</FormLabel>
                                <RadioGroup
                                    aria-label="price direction"
                                    name="price direction"
                                    className={classes.group}
                                    value={this.state.direction}
                                    onChange={this.handleRadioChange}
                                >
                                    <FormControlLabel value="down" control={<Radio />} label="Less Than" />
                                    <FormControlLabel value="up" control={<Radio />} label="More Than" />
                                </RadioGroup>
                            </FormControl>
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

export default withStyles(styles)(AlertStepper);