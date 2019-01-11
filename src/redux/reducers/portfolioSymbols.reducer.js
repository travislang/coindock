const portfolioSymbols = (state = [], action) => {
    switch (action.type) {
        case 'SET_PORTFOLIO_SYMBOLS':
            return action.payload;
        case 'UPDATE_PORTFOLIO_SYMBOLS':
            const tempState = state.map(ticker => {
                let temp = action.payload.msg.find(item => ticker.symbol == item.data.s);
                if (temp) {
                    return {
                        ...ticker,
                        previous_price: ticker.last_price,
                        last_price: temp.data.c,
                        price_change: temp.data.P,
                        high: temp.data.h,
                        low: temp.data.l
                    }
                }
                else {
                    return ticker
                }
            })
            return calculateUsd(action.payload.btc, action.payload.eth, tempState)
        default:
            return state;
    }
}

function calculateUsd(btc, eth, coins) {
    const btcPrice = btc;
    const ethPrice = btcPrice * eth;
    // console.log('this is btc price', btcPrice);
    // console.log('this is eth price', ethPrice);

    const newState = coins.map(ticker => {
        if (ticker.quote_asset === 'BTC') {
            let usdPrice = btcPrice * ticker.last_price;
            let usdPrev = btcPrice * ticker.previous_price;
            let usdHigh = btcPrice * ticker.high;
            let usdLow = btcPrice * ticker.low;
            return {
                ...ticker,
                previous_price: usdPrev,
                usd_price: usdPrice,
                high: usdHigh,
                low: usdLow
            }
        }
        else if (ticker.quote_asset === 'USDT') {
            return {
                ...ticker,
                usd_price: ticker.last_price,
            }
        }
        else if (ticker.quote_asset === 'ETH') {
            let usdPrice = ethPrice * ticker.last_price;
            let usdPrev = ethPrice * ticker.previous_price;
            let usdHigh = ethPrice * ticker.high;
            let usdLow = ethPrice * ticker.low;
            return {
                ...ticker,
                previous_price: usdPrev,
                usd_price: usdPrice,
                high: usdHigh,
                low: usdLow
            }
        }
    })
    return newState;
}

export default portfolioSymbols;