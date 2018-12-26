import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchSymbols() {
    try{
        const responseSymbols = yield call(axios.get, '/api/crypto/symbols')
        yield put({type: 'SET_SYMBOLS', payload: responseSymbols.data})
    } 
    catch( err ) {
        console.log('error in symbolsSaga:', err);
    }
}




function* symbolsSaga() {
    yield takeLatest('FETCH_SYMBOLS', fetchSymbols);
}

export default symbolsSaga;