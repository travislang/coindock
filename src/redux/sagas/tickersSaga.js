import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchTickers() {
    try{
        const responseTickers = yield call(axios.get, '/api/crypto/tickers')
        yield put({type: 'SET_TICKERS', payload: responseTickers.data})
    } 
    catch( err ) {
        console.log('error in symbolsSaga:', err);
    }
}





function* tickersSaga() {
    yield takeLatest('FETCH_TICKERS', fetchTickers);
}

export default tickersSaga;