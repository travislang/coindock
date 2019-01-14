const tickers = (state = [], action) => {
    switch (action.type) {
        case 'SET_TICKERS':
            return [...state, ...action.payload];
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

function calculateUsd(btc, eth, coins) {
    const btcPrice = btc;
    const ethPrice = btcPrice * eth;

    const newState = coins.map(ticker => {
        if (ticker.quote_asset === 'BTC') {
            let usdPrice = btcPrice * ticker.last_price;
            let usdPrev = btcPrice * ticker.previous_price;
            return {
                ...ticker,
                previous_price: usdPrev,
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

// working but work on optimization for only 2 digit price to reduce state updates
// function calculateUsd(coins) {
//     const btc = coins.filter(item => {
//         return item.symbol === 'BTCUSDT'
//     })
//     if (btc.length === 0) {
//         console.log('error in tickers saga. BTC is not in the redux store yet');
//         return coins
//     }
//     const eth = coins.filter(item => {
//         return item.symbol === 'ETHBTC'
//     })
//     if (eth.length === 0) {
//         console.log('error in tickers saga. ETH is not in the redux store yet');
//         return coins
//     }
//     const btcPrice = btc[0].last_price;
//     const ethPrice = eth[0].last_price;
//     console.log('this is btc price', btcPrice);
//     console.log('this is eth price', ethPrice);
    
//     const newState = coins.map(ticker => {
//         if(ticker.quote_asset === 'BTC') {
//             let usdPrice = btcPrice * ticker.last_price;
//             return {
//                 ...ticker,
//                 usd_price: usdPrice,
//             }
//         }
//         else if(ticker.quote_asset === 'USDT' ) {
//             return {
//                 ...ticker,
//                 usd_price: ticker.last_price,
//             }
//         }
//         else if(ticker.quote_asset === 'ETH') {
//             let usdPrice = (btcPrice * ethPrice) * ticker.last_price;
//             return {
//                 ...ticker,
//                 usd_price: usdPrice,
//             }
//         }
//     })
//     console.log('this is new state', newState);
    
//     return newState;
// }

export default tickers;