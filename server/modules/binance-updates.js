const pool = require('../modules/pool');
const axios = require('axios');

//get all available trading symbols from binance REST API
function fetchExchangeSymbols() {
    axios.get('https://api.binance.com/api/v1/exchangeInfo')
        .then(response => {
            //filter coins to get only certain quote asset pairs
            let symbols = response.data.symbols.filter(item => {
                if (item.quoteAsset === 'BTC' || item.quoteAsset === 'ETH' || item.quoteAsset === 'USDT') {
                    return item
                }
            });
            //badSymbols don't have logos on CMC
            let badSymbols = ['BCHSV', 'BQX', 'HSR', 'IOTA', 'RPX', 'YOYO']
            // filter coins again to remove duplicate baseasset coins
            symbols = symbols.filter((item, i, self) => {
                return i === self.findIndex(t => {
                    return t.baseAsset === item.baseAsset && !badSymbols.includes(item.baseAsset);
                })
            })

            //save symbol pairs to db for later use
            // need to add promise.all here?
            symbols.map(item => {
                pool.query(`INSERT INTO "symbols" ("symbol", "base_asset", "quote_asset")
                VALUES($1, $2, $3);`, [item.symbol, item.baseAsset, item.quoteAsset])
                    .then(() => {
                    }).catch(err => {
                        console.log('error in symbols query:', err);
                        res.sendStatus(500);
                    })
            })

            // baseSymbols used to get logos from CMC
            let baseSymbols = symbols.map(item => {
                return item.baseAsset
            });
            // dont request logos for symbols without them
            baseSymbols = baseSymbols.filter(item => {
                return !badSymbols.includes(item);
            })
            baseSymbols = baseSymbols.join(',');
            axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?CMC_PRO_API_KEY=${process.env.CMC_API_KEY}&symbol=${baseSymbols}`).then(resp => {
                let obj = resp.data.data;

                for (let key in obj) {
                    pool.query(`UPDATE "symbols"
                    SET "logo" = $1, "symbol_name" = $2
                    WHERE "base_asset" = $3;`, [obj[key].logo, obj[key].name, key])
                        .then(result => {
                        }).catch(err => {
                            console.log('error in insert cmc', err);

                        })
                }
                res.sendStatus(201)
            }).catch(err => {
                console.log('error in cmc get:', err);
                res.sendStatus(500);
            })
        }).catch(err => {
            console.log('error:', err);
        })
}

function updateSymbolPrices() {
    console.log('in update');
    
    // placeholder to use binance data later
    let binanceData = [];
    // careful this endpoint has 40 rate limit - 1200 / min max
    axios.get('https://api.binance.com/api/v1/ticker/24hr')
    .then( response => {
        binanceData = response.data;
        return response.data
    })
    .then(() => {
        return pool.query(`SELECT * FROM "symbols";`)
            .then(({ rows }) => {
                return rows;
            })
            .catch( err => {
                console.log('error getting all tickers from DB', err);
            })
    })
    .then( result => { // result is DB data now
        for(let item of result) {
            binanceData.find(coin => {
                if(coin.symbol === item.symbol) { // if there is a match update properties
                    item.last_price = coin.lastPrice;
                    item.volume = coin.volume;
                    item.price_change = coin.priceChangePercent;
                }
            })
        }
        updateDbSymbols(result) // pass in updated results
        return {};
    })
    .catch( err => {
        console.log('error in updateSymbolPrices function', err);
    })
}

function updateDbSymbols(symbols) {
    let promiseChain = Promise.resolve();
    for (let item of symbols) {
        const params = [
                item.last_price,
                item.volume,
                item.price_change,
                item.symbol
            ]
        promiseChain = promiseChain.then(() => {
            return pool.query(`UPDATE "symbols"
                        SET "last_price" = $1, "volume" = $2, "price_change" = $3
                        WHERE "symbol" = $4;`, params)
                .then(result => {
                    return result;
                })
                .catch(err => {
                    console.log('error in promise chain of all tickers', err);
                })
        })
    }
    promiseChain.then(() => {
        console.log('updated symbols in DB');
        return;
    })
}

module.exports = {
    updateSymbolPrices: updateSymbolPrices,
    fetchExchangeSymbols: fetchExchangeSymbols
}