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

import './App.css';
import 'typeface-roboto';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import MainAppBar from '../MainAppBar/MainAppBar';

//imports MUI theme config
import darkTheme from '../MuiThemes/DarkTheme';

class App extends Component {
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_USER' })
        this.props.dispatch({ type: 'FETCH_TICKERS' })
    }

    render() {
        return (
            <MuiThemeProvider theme={darkTheme}>
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
                                path="/profile"
                                component={ProfilePage}
                            />

                            {/* If none of the other routes matched, we will show a 404. */}
                            <Route render={() => <h1>404</h1>} />
                        </Switch>
                        <Footer />
                    </div>
                </Router>
            </MuiThemeProvider>
        )
    }
}

export default connect()(App);
