import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "LOGIN" actions
function* fbLogin(action) {
    try {
        debugger;
        yield axios.get('api/user/fb/login');
        // after the user has logged in
        // get the user information from the server
        console.log('made it to next');
        
        yield put({ type: 'FETCH_USER' });
    } catch (error) {
        console.log('Error with user login:', error);
        if (error.response.status === 401) {
            // The 401 is the error status sent from passport
            // if user isn't in the database or
            // if the username and password don't match in the database
            yield put({ type: 'LOGIN_FAILED' });
        } else {
            // Got an error that wasn't a 401
            // Could be anything, but most common cause is the server is not started
            yield put({ type: 'LOGIN_FAILED_NO_CODE' });
        }
    }
}

function* facebookSaga() {
    yield takeLatest('FB_LOGIN', fbLogin);
}

export default facebookSaga;