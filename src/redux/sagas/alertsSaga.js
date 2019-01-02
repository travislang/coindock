import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchAlerts() {
    try {
        const alerts = yield call(axios.get, '/api/alerts')
        yield put({type: 'SET_ALERTS', payload: alerts.data})
    }
    catch (err) {
        console.log('error in fetch alerts saga', err);
    }
}

function* toggleCoinAlerts(action) {
    try {
        yield call(axios.put, `/api/alerts/toggle-alert/${action.payload}`);
        yield put({type: 'FETCH_ALERTS'})
    }
    catch (err) {
        console.log('error in toggle coin alerts saga', err);
    }
}

function* alertsSaga() {
    yield takeLatest('FETCH_ALERTS', fetchAlerts);
    yield takeLatest('TOGGLE_COIN_ALERTS', toggleCoinAlerts);
}

export default alertsSaga;