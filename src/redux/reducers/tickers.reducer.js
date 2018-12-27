const tickers = (state = [], action) => {
    switch (action.type) {
        case 'SET_TICKERS':
            return action.payload;
        case 'UPDATE_TICKERS':
            return state.map( ticker => {
                let temp = action.payload.data.find(item => ticker.symbol == item.s);
                if( temp ) {
                    return {
                        ...ticker,
                        last_price: temp.c,
                        price_change: temp.P
                    }
                }
                else {
                    return ticker
                }
                    
            })
        default:
            return state;
    }
};

export default tickers;