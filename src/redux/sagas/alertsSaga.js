import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchAlerts() {
    try {
        
    }
    catch (err) {
        console.log('error in ', err);
    }
}

function* alertsSaga() {
    yield takeLatest('FETCH_ALERTS', fetchAlerts);
}

export default alertsSaga;