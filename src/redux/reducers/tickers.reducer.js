const tickers = (state = [], action) => {
    switch (action.type) {
        case 'SET_TICKERS':
            return [...state, ...action.payload];
        case 'SET_SEARCH_TICKERS':
            return action.payload;
        case 'CLEAR_TICKERS':
            return [];
        case 'UPDATE_TICKERS':
            const tempState = state.map(ticker => {
                if (action.payload && action.payload.msg) {
                    let temp = action.payload.msg.find(item => ticker.symbol == item.s);
                    if (temp) {
                        return {
                            ...ticker,
                            previous_price: ticker.last_price,
                            last_price: temp.c,
                            price_change: temp.P,
                        }
                    }
                    else {
                        return {
                            ...ticker,
                            previous_price: ticker.last_price,
                        }
                    }
                }
            })
            return calculateUsd(action.payload.btc, action.payload.eth, tempState)
        default:
            return state;
    }
};

//getting error quote_asset of undefined reducer is getting called with empty arr

function calculateUsd(btc, eth, coins) {
    const btcPrice = btc;
    const ethPrice = btcPrice * eth;
    // stops error if coins is undefined
    let newCoins = coins.length > 0 ? coins : [];
    const newState = newCoins.map(ticker => {
        if (ticker && ticker.quote_asset === 'BTC') {
            let usdPrice = btcPrice * ticker.last_price;
            let usdPrev = btcPrice * ticker.previous_price;
            return {
                ...ticker,
                previous_price: usdPrev,
                usd_price: usdPrice,
            }
        }
        else if (ticker && ticker.quote_asset === 'USDT') {
            return {
                ...ticker,
                usd_price: ticker.last_price,
            }
        }
        else if (ticker && ticker.quote_asset === 'ETH') {
            let usdPrice = ethPrice * ticker.last_price;
            let usdPrev = ethPrice * ticker.previous_price;
            return {
                ...ticker,
                previous_price: usdPrev,
                usd_price: usdPrice,
            }
        }
    })
    return newState;
}

export default tickers;