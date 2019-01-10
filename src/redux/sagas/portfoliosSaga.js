import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchPortfolios(action) {
    try{ 
        const responsePortfolios = yield call(axios.get, '/api/portfolio');
        yield put({ type: 'SET_PORTFOLIOS', payload: responsePortfolios.data })
        const portfolioId = responsePortfolios.data.filter(item => {
            return item.active;
        })
        yield put({ type: 'FETCH_PORTFOLIO_SYMBOLS', payload: {
            portfolio: portfolioId[0].id,
            socket: action.socket
        }})
    }
    catch( err ) {
        console.log('error in fetchPortfolios saga', err);
    }
}
function* fetchPortfolioSymbols(action) {
    const responseSymbols = yield call(axios.get, `/api/portfolio/symbols/${action.payload.portfolio}`);
    // gets kline data for charts
    const newResponse = yield call(axios.post, '/api/crypto/klines', {data: responseSymbols.data})
    yield put({ type: 'SET_PORTFOLIO_SYMBOLS', payload: newResponse.data })
    action.payload.socket.emit('portfolioStream', newResponse.data)
}
//sets users active portfolio
function* setActive(action) {
    yield call(axios.post, '/api/portfolio', action.payload)
    yield put({type: 'FETCH_PORTFOLIOS'})
}
function* deletePortfolio(action) {
    yield call(axios.delete, `/api/portfolio/${action.payload.portfolioId}`)
    yield put({type: 'SET_ACTIVE', payload: {
            data: action.payload.portfolioToMakeActive
        }
    })
}

function* deletePortfolioCoin(action) {
    yield call(axios.delete, `/api/portfolio/coin/${action.payload.coinId}?pid=${action.payload.portfolioId}`)
    yield put({ type: 'FETCH_PORTFOLIO_SYMBOLS', payload: action.payload.portfolioId})
}
function* addPortfolio(action) {
    const responseId = yield call(axios.post, '/api/portfolio/new', action.payload)
    yield put({type: 'SET_ACTIVE', payload: {
        data: responseId.data[0].id
    }})
}
function* addCoin(action) {
    try {
        console.log('payload', action.payload);
        yield call(axios.post, '/api/portfolio/add', action.payload);
        yield put({ type: 'FETCH_PORTFOLIO_SYMBOLS', payload: action.payload.portfolio })
        // call snackbar confirmation here
    } catch ( err ) {
        console.log('error adding coin to portfolio', err);
    }
    
}
function* portfolioSaga() {
    yield takeLatest('FETCH_PORTFOLIOS', fetchPortfolios);
    yield takeLatest('FETCH_PORTFOLIO_SYMBOLS', fetchPortfolioSymbols);
    yield takeLatest('SET_ACTIVE', setActive);
    yield takeLatest('ADD_COIN', addCoin);
    yield takeLatest('DELETE_PORTFOLIO', deletePortfolio);
    yield takeLatest('DELETE_PORTFOLIO_COIN', deletePortfolioCoin);
    yield takeLatest('ADD_PORTFOLIO', addPortfolio);
}

export default portfolioSaga;