const tickers = (state = [], action) => {
    switch (action.type) {
        case 'SET_TICKERS':
            return action.payload;
        case 'UPDATE_PRICE':
        
        default:
            return state;
    }
};

export default tickers;