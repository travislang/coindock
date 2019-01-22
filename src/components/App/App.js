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
import LandingPage from '../LandingPage/LandingPage';
import ReconnectError from '../ReconnectError/ReconnectError';

import './App.css';
import 'typeface-roboto';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import MainAppBar from '../MainAppBar/MainAppBar';
import BottomNav from '../BottomNav/BottomNav';
import Hidden from '@material-ui/core/Hidden';

//context for one socket instance
import SocketContext from '../SocketContext'
import io from 'socket.io-client'

//imports MUI theme config
import darkTheme from '../MuiThemes/DarkTheme';

let socket = io();

const styles = {
    position: 'fixed',
    bottom: 0,
    width: '100%',
}

class App extends Component {
    
    componentDidMount() {
        // check for service worker and notification support and install sw
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            console.log('Service Worker and Push is supported');
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(function (swReg) {
                        console.log('Service Worker is registered', swReg);
                        let swRegistration = swReg;
                    })
                    .catch(function (error) {
                        console.error('Service Worker Error', error);
                    });
            })
            
        }
        else {
            console.warn('Push messaging is not supported');
        }
        //start socket connection
        socket.on('connect', () => {
            console.log('the client connected');
            
        })
        socket.on('triggerRender', (msg) => {
            // updates alerts badge
            this.props.dispatch({ type: 'FETCH_USER' })
            this.props.dispatch({ type: 'FETCH_ALERTS' })
        })
        socket.on('disconnect', () => {
            console.log('the client disconnected');
        })
        this.props.dispatch({ type: 'FETCH_USER' })
        // this.props.dispatch({ type: 'FETCH_TICKERS' })
        this.props.dispatch({ type: 'FETCH_TICKER_NAMES' })
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
                            {this.props.user.id && <MainAppBar />}
                            <Switch>
                                <Redirect exact from="/_=_" to="/home" />
                                <Route
                                    exact
                                    path="/"
                                    component={LandingPage}
                                />
                                <Route
                                    exact
                                    path="/about"
                                    component={AboutPage}
                                />
                                <ProtectedRoute
                                    exact
                                    path="/home"
                                    component={UserPage}
                                />
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
                                <Route render={() => <h1>404</h1>} />
                            </Switch>
                            {!this.props.connectedFlag && <ReconnectError />}
                            {this.props.user.id && 
                                <Hidden mdUp>
                                    <BottomNav />
                                </Hidden>
                            }
                        </div>
                    </Router>
                </SocketContext.Provider>
            </MuiThemeProvider>
        )
    }
}

const mapStateToProps = state => ({
    connectedFlag: state.connectedFlag,
    user: state.user
});

export default connect(mapStateToProps)(App);
