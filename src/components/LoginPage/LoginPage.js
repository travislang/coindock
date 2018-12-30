import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

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
    fbButton: {
        margin: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 2,
        minWidth: '60%',
        backgroundColor: '#3b5998',
    },
    linkButton: {
        color: theme.palette.primary.dark
    },
    overlap: {
        marginBottom: -theme.spacing.unit * 2,
    }
});

class LoginPage extends Component {
    state = {
        username: '',
        password: '',
    };

    login = (event) => {
        event.preventDefault();

        if (this.state.username && this.state.password) {
            this.props.dispatch({
                type: 'LOGIN',
                payload: {
                    username: this.state.username,
                    password: this.state.password,
                },
            });
        } else {
            this.props.dispatch({ type: 'LOGIN_INPUT_ERROR' });
        }
    } // end login

    handleChange = propertyName => (event) => {
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
                    <Grid item className={classes.border} xs={10} sm={8} md={7} lg={4}>
                        <div>
                            <Typography align='center' variant="h4">
                            USER LOGIN
                            </Typography>
                            <Typography align='center' variant="subtitle2" className={classes.textColor} gutterBottom>
                            Login with your social media account
                            </Typography>
                        </div>
                        <Grid justify='center' container>
                            <Button href='http://localhost:5000/auth/facebook' variant="contained" className={classes.fbButton}>
                                Login with Facebook
                            </Button>
                        </Grid>
                        <Typography className={classes.overlap} color='primary' align='center' variant="h6">
                            OR
                        </Typography>
                        <Divider />
                        <Divider />
                        <form className={classes.container} noValidate autoComplete="off" onSubmit={this.login}>
                            <TextField
                                id="outlined-name"
                                label="Username"
                                className={classes.textField}
                                value={this.state.username}
                                onChange={this.handleChange('username')}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="outlined-password-input"
                                label="Password"
                                className={classes.textField}
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                type="password"
                                autoComplete="current-password"
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
                                LOGIN
                            </Button>
                        </form>
                        <div>
                            <Typography align='center' variant="body2" className={classes.textColor} gutterBottom>
                                Not a member?
                                <Button onClick={() => { this.props.dispatch({ type: 'SET_TO_REGISTER_MODE' }) }}
                                color="primary" className={classes.linkButton}>
                                    Register Now
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

export default connect(mapStateToProps)(withStyles(styles)(LoginPage));
