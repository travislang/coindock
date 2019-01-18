import { combineReducers } from 'redux';
import errors from './errorsReducer';
import loginMode from './loginModeReducer';
import user from './userReducer';
import tickers from './tickers.reducer';
import portfolios from './portfolios.reducer';
import expanded from './expanded.reducer';
import portfolioSymbols from './portfolioSymbols.reducer';
import alerts from './alerts.reducer';
import tickerNames from './tickerNames.reducer';
import search from './search.reducer';
import loading from './loading.reducer';
import connectedFlag from './connectedFlag.reducer';

const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  loginMode, // will have a value of 'login' or 'registration' to control which screen is shown
  user, // will have an id and username if someone is logged in
  tickers, // contains all tickers
  portfolios, // contains users portfolios
  expanded, // used to control accordian expansion items
  portfolioSymbols,
  alerts,
  tickerNames,
  search,
  loading,
  connectedFlag // used to know if server socket to API lost connection
});

export default rootReducer;
