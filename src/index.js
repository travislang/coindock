import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import rootReducer from './redux/reducers'; // imports ./redux/reducers/index.js
import rootSaga from './redux/sagas'; // imports ./redux/sagas/index.js

import { SnackbarProvider } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

import App from './components/App/App';



const sagaMiddleware = createSagaMiddleware();

// this line creates an array of all of redux middleware you want to use
// we don't want a whole ton of console logs in our production code
// logger will only be added to your project if your in development mode
const middlewareList = process.env.NODE_ENV === 'development' ?
    [sagaMiddleware, logger] :
    [sagaMiddleware];

const store = createStore(
    // tells the saga middleware to use the rootReducer
    // rootSaga contains all of our other reducers
    rootReducer,
    // adds all middleware to our project including saga and logger
    applyMiddleware(...middlewareList),
);

// tells the saga middleware to use the rootSaga
// rootSaga contains all of our other sagas
sagaMiddleware.run(rootSaga);

//used for snackbars
function CustomSnackbar(props) {
    const { classes } = props;
    return (
        <SnackbarProvider
            maxSnack={3}
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                >
                    <CloseIcon />
                </IconButton>
            ]}
            classes={{
                variantSuccess: classes.success,
                variantError: classes.error,
                variantWarning: classes.warning,
                variantInfo: classes.info,
            }}
        >
            <App />
        </SnackbarProvider>
    )
}
const styles = {
    success: { margin: 0, padding: '0 20px 0 20px' },
    error: { margin: 0, padding: '0 20px 0 20px' },
    warning: { margin: 0, padding: '0 20px 0 20px' },
    info: { margin: 0, padding: '0 20px 0 20px' },
};

const SnackbarWrapper = withStyles(styles)(CustomSnackbar)


ReactDOM.render(
    <Provider store={store}>
        <SnackbarWrapper>
                <App />
        </SnackbarWrapper>
    </Provider>,
        document.getElementById('react-root'),
      );
