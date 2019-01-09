const calculateUsd = (state = [], action) => {
    switch (action.type) {
        case 'CALCULATE_USD':
            const btcPrice = action.payload.btc;
            const eth = action.payload.eth;
            const ethPrice = btcPrice * eth;
            const coins = action.payload.coins;

            const newState = coins.map(ticker => {
                if (ticker.quote_asset === 'BTC') {
                    let usdPrice = btcPrice * ticker.last_price;
                    return {
                        ...ticker,
                        usd_price: usdPrice,
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
                    return {
                        ...ticker,
                        usd_price: usdPrice,
                    }
                }
            })
            console.log('this is new state', newState);
            return newState;
        default:
            return state;
    }
}

export default calculateUsd;