import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchPortfolios() {
    const responsePortfolios = yield call(axios.get, '/api/portfolio');
    yield put({type: 'SET_PORTFOLIOS', payload: responsePortfolios.data})
}

function* fetchPortfolioSymbols(action) {
    const responseSymbols = yield call(axios.get, `/api/portfolio/symbols/${action.payload}`);
    yield put({ type: 'SET_PORTFOLIO_SYMBOLS', payload: responseSymbols.data })
}

//sets users active portfolio
function* setActive(action) {
    console.log('calling post with:', action.payload);
    yield call(axios.post, '/api/portfolio', action.payload)
    yield put({type: 'SET_ACTIVE_PORTFOLIO'})
}

function* portfolioSaga() {
    yield takeLatest('FETCH_PORTFOLIOS', fetchPortfolios);
    yield takeLatest('FETCH_PORTFOLIO_SYMBOLS', fetchPortfolioSymbols);
    yield takeLatest('SET_ACTIVE', setActive);
}

export default portfolioSaga;