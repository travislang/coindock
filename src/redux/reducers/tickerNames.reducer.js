const tickerNames = (state = [], action) => {
    switch (action.type) {
        case 'SET_TICKER_NAMES':
            return action.payload;
        default:
            return state;
    }
}

export default tickerNames;