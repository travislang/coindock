import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchTickers() {
    try{
        const responseTickers = yield call(axios.get, '/api/crypto/alltickers')
        yield put({ type: 'SET_TICKERS', payload: responseTickers.data })
    } 
    catch( err ) {
        console.log('error in symbolsSaga:', err);
    }
}

function* fetchTickerNames() {
    try{
        const responseTickers = yield call(axios.get, '/api/crypto/tickernames')
        yield put({ type: 'SET_TICKER_NAMES', payload: responseTickers.data })
    } 
    catch( err ) {
        console.log('error in symbolsSaga:', err);
    }
}

function* tickersSaga() {
    yield takeLatest('FETCH_TICKERS', fetchTickers);
    yield takeLatest('FETCH_TICKER_NAMES', fetchTickerNames);
}

export default tickersSaga;