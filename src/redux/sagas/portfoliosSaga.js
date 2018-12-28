import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchPortfolios() {
    const responsePortfolios = yield call(axios.get, '/api/portfolio');
    yield put({type: 'SET_PORTFOLIOS', payload: responsePortfolios.data})
}

function* tickersSaga() {
    yield takeLatest('FETCH_PORTFOLIOS', fetchPortfolios);
}

export default tickersSaga;