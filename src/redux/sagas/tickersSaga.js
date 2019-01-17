import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

function* fetchTickers(action) {
    try{
        const responseTickers = yield call(axios.get, `/api/crypto/alltickers?q=${action.payload}`)
        yield put({ type: 'SET_TICKERS', payload: responseTickers.data })
    } 
    catch( err ) {
        console.log('error in symbolsSaga:', err);
    }
}

function* fetchSearchTicker(action) {
    try{
        const responseTicker = yield call(axios.get, `/api/crypto/search-ticker?symbolId=${action.payload}`)
        yield put({ type: 'SET_SEARCH_TICKERS', payload: responseTicker.data })
    } 
    catch( err ) {
        console.log('error in searchTickerSaga:', err);
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
    yield takeEvery('FETCH_SEARCH_TICKER', fetchSearchTicker);
    yield takeLatest('FETCH_TICKER_NAMES', fetchTickerNames);
}

export default tickersSaga;