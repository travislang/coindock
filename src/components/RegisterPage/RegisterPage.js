import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: theme.spacing.unit * 2
    },
    border: {
        border: `2px solid ${theme.palette.divider}`,
        borderRadius: '20px',
        padding: theme.spacing.unit * 2
    },
    textField: {
        minWidth: '60%',
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    textColor: {
        color: theme.palette.text.disabled
    },
    button: {
        margin: theme.spacing.unit * 2,
        minWidth: '60%'
    },
    linkButton: {
        color: theme.palette.primary.dark
    },
});


class RegisterPage extends Component {
    state = {
        name: '',
        username: '',
        password: '',
        verifyPassword: ''
    };

    registerUser = (event) => {
        event.preventDefault();

        if (this.state.username && 
            this.state.password && 
            this.state.name &&
            this.state.password == this.state.verifyPassword
            ) {
                this.props.dispatch({
                    type: 'REGISTER',
                    payload: {
                        name: this.state.name,
                        username: this.state.username,
                        password: this.state.password,
                    },
                });
        } else {
            this.props.dispatch({ type: 'REGISTRATION_INPUT_ERROR' });
        }
    } // end registerUser

    handleInputChangeFor = propertyName => (event) => {
        this.setState({
            [propertyName]: event.target.value,
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container justify='center' alignItems='center' className={classes.rootContainer} >
                    {/* {this.props.errors.loginMessage && (
                    <h2
                        className="alert"
                        role="alert"
                    >
                        {this.props.errors.loginMessage}
                    </h2>
                    )} */}
                    <Grid item className={classes.border} xs={10} md={7} lg={4}>
                        <div>
                            <Typography align='center' variant="h4">
                                REGISTER
                            </Typography>
                        </div>
                        <form className={classes.container} noValidate autoComplete="off" onSubmit={this.registerUser}>
                            <TextField
                                id="outlined-name"
                                label="Name"
                                className={classes.textField}
                                value={this.state.name}
                                onChange={this.handleInputChangeFor('name')}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="outlined-username"
                                label="Username"
                                className={classes.textField}
                                value={this.state.username}
                                onChange={this.handleInputChangeFor('username')}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="outlined-password-input"
                                label="Password"
                                className={classes.textField}
                                value={this.state.password}
                                onChange={this.handleInputChangeFor('password')}
                                type="password"
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="outlined-password-verify-input"
                                label="Re Enter Password"
                                className={classes.textField}
                                value={this.state.verifyPassword}
                                onChange={this.handleInputChangeFor('verifyPassword')}
                                type="password"
                                margin="normal"
                                variant="outlined"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                // onClick={this.login}
                                type='submit'
                            >
                                REGISTER
                            </Button>
                        </form>
                        <div>
                            <Typography align='center' variant="body2" className={classes.textColor} gutterBottom>
                                Already Registered?
                                <Button onClick={() => { this.props.dispatch({ type: 'SET_TO_LOGIN_MODE' }) }}
                                    color="primary" className={classes.linkButton}>
                                    Login
                                </Button>
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
    errors: state.errors,
});

export default connect(mapStateToProps)(withStyles(styles)(RegisterPage));
