import React, { Component } from 'react';
import {
    HashRouter as Router,
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';

import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import InfoPage from '../InfoPage/InfoPage';
import PortfolioPage from '../PortfolioPage/PortfolioPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import AlertsPage from '../AlertsPage/AlertsPage';
import NewAlert from '../NewAlert/NewAlert';

import './App.css';
import 'typeface-roboto';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import MainAppBar from '../MainAppBar/MainAppBar';

//context for one socket instance
import SocketContext from '../SocketContext'
import io from 'socket.io-client'

//imports MUI theme config
import darkTheme from '../MuiThemes/DarkTheme';

let socket = io('http://localhost:5000');

class App extends Component {
    componentDidMount() {
        //start socket connection
        socket.on('connect', () => {
            console.log('the client connected');
        })
        socket.on('disconnect', () => {
            console.log('the client disconnected');
        })
        this.props.dispatch({ type: 'FETCH_USER' })
        this.props.dispatch({ type: 'FETCH_TICKERS' })
        this.props.dispatch({ type: 'FETCH_TICKER_NAMES' })
        //so its loaded by the time user goes to alerts page
        this.props.dispatch({ type: 'FETCH_ALERTS' })
        this.props.dispatch({ type: 'FETCH_PORTFOLIOS' })
    }
    componentWillUnmount() {
        socket.close();
    }

    render() {
        return (
            <MuiThemeProvider theme={darkTheme}>
                <SocketContext.Provider value={socket}>
                    <CssBaseline />
                    <Router>
                        <div>
                            <MainAppBar />
                            <Switch>
                                {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
                                <Redirect exact from="/" to="/home" />
                                <Redirect exact from="/_=_" to="/home" />
                                {/* Visiting localhost:3000/about will show the about page.
                            This is a route anyone can see, no login necessary */}
                                <Route
                                    exact
                                    path="/about"
                                    component={AboutPage}
                                />
                                {/* For protected routes, the view could show one of several things on the same route.
                            Visiting localhost:3000/home will show the UserPage if the user is logged in.
                            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
                            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
                                <ProtectedRoute
                                    exact
                                    path="/home"
                                    component={UserPage}
                                />
                                {/* This works the same as the other protected route, except that if the user is logged in,
                            they will see the info page instead. */}
                                <ProtectedRoute
                                    path="/info"
                                    component={InfoPage}
                                />
                                <ProtectedRoute
                                    path="/portfolio"
                                    component={PortfolioPage}
                                />
                                <ProtectedRoute
                                    path="/alerts"
                                    component={AlertsPage}
                                />
                                <ProtectedRoute
                                    path="/new-alert/:id"
                                    component={NewAlert}
                                />
                                <ProtectedRoute
                                    path="/profile"
                                    component={ProfilePage}
                                />

                                {/* If none of the other routes matched, we will show a 404. */}
                                <Route render={() => <h1>404</h1>} />
                            </Switch>
                            <Footer />
                        </div>
                    </Router>
                </SocketContext.Provider>
            </MuiThemeProvider>
        )
    }
}

export default connect()(App);
