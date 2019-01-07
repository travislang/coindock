const portfolioSymbols = (state = [], action) => {
    switch (action.type) {
        case 'SET_PORTFOLIO_SYMBOLS':
            return action.payload;
        case 'UPDATE_PORTFOLIO_SYMBOLS':
            const tempState = state.map(ticker => {
                let temp = action.payload.msg.find(item => ticker.symbol == item.data.s);
                console.log('this is temp', temp);
                console.log('this is action', action.payload.msg);
                
                if (temp) {
                    return {
                        ...ticker,
                        last_price: temp.data.c,
                        price_change: temp.data.P
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
    console.log('in calcUSD', coins);
    const btcPrice = btc;
    const ethPrice = btcPrice * eth;
    console.log('this is btc price', btcPrice);
    console.log('this is eth price', ethPrice);

    const newState = coins.map(ticker => {
        console.log('this is ticker in convert', ticker);
        
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
            let usdPrice = eth * ticker.last_price;
            return {
                ...ticker,
                usd_price: usdPrice,
            }
        }
    })
    console.log('this is new state', newState);
    return newState;
}

export default portfolioSymbols;