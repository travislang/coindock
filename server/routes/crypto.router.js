const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const axios = require('axios');
const router = express.Router();

//get all available trading symbols from binance REST API
router.get('/binance', (req, res) => {
    console.log('made it to binance route');
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
                .then( () => {
                }).catch( err => {
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
                        }).catch( err => {
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
})

router.post('/klines', (req, res) => {
    // time in ms
    let endTime = Date.now();
    console.log('end time', endTime);
    // time in ms minus 7 days
    let startTime = endTime - 604800000;
    console.log('start time', startTime);
    let symbols = req.body.data;
    // promise chain to wait for all requests to come back
    let promiseChain = Promise.resolve();
    for(let symbol of symbols) {
        promiseChain = promiseChain.then(() => {
            return axios.get(`https://api.binance.com/api/v1/klines?symbol=${symbol.symbol}&interval=8h&startTime=${startTime}&endTime=${endTime}`)
                .then(res => {
                    return symbol.kline = res.data
                })
        });
    }
    promiseChain.then(() => {
        res.send(symbols)
    })
})

router.get('/tickernames', (req, res) => {
    pool.query(`SELECT "id", "symbol_name" FROM "symbols" ORDER BY "id" ASC;`)
        .then(result => {
            res.send(result.rows)
        }).catch(err => {
            console.log('error getting symbol names from db:', err);
            res.sendStatus(500);
        })
})

router.get('/alltickers', (req, res) => {
    const amount = req.query.q;
    //comment out to keep from hitting api
    axios.get('https://api.binance.com/api/v1/ticker/24hr')
    .then( response => {
        let promiseChain = Promise.resolve();
        for( let item of response.data) {
            const params = [
                item.lastPrice,
                item.volume,
                item.priceChangePercent,
                item.symbol
            ]
            promiseChain = promiseChain.then(() => {
                return pool.query(`UPDATE "symbols"
                    SET "last_price" = $1, "volume" = $2, "price_change" = $3
                    WHERE "symbol" = $4;`, params)
                    .then(result => {
                        console.log('promise chain', item);
                        
                        return result;
                    })
                    .catch(err => {
                        console.log('error in promise chain all tickers', err);
                    })
            })
        }
        return promiseChain;
    })
    .catch(err => {
        console.log('error getting 24h data from binance', err);
        res.sendStatus(500);
    })
    .then(() => {
        return pool.query(`SELECT * FROM "symbols" ORDER BY "id" ASC LIMIT 20 OFFSET $1;`, [amount])
    })
    .then(result => {
        res.send(result.rows)
    }).catch(err => {
        console.log('error in alltickers route:', err);
        res.sendStatus(500);
    })
})

router.get('/search-ticker', (req, res) => {
    const symbolId = req.query.symbolId;
    pool.query(`SELECT "symbol" FROM "symbols" WHERE "id" = $1;`, [symbolId])
    .then(({rows}) => {
        return rows[0];
    })
    .then( resp => {
        return axios.get(`https://api.binance.com/api/v1/ticker/24hr?symbol=${resp.symbol}`)
    }) 
    .then( response => {
        return response.data
    })
    .catch( err => {
        console.log('error getting symbol response from binance.  The ticker symbol is probably invalid', err);
        res.sendStatus(404);
    })
    .then( res => {
        const params = [
            res.lastPrice,
            res.volume,
            res.priceChangePercent,
            res.symbol
        ]
        return pool.query(`UPDATE "symbols"
                    SET "last_price" = $1, "volume" = $2, "price_change" = $3
                    WHERE "symbol" = $4;`, params)
            .then(result => {
                return result;
            })
    })
    .then(() => {
        return pool.query(`SELECT * FROM "symbols" WHERE "id" = $1;`, [symbolId])
    })
    .then(result => {
        res.send(result.rows)
    }).catch(err => {
        console.log('error in search-ticker route:', err);
        res.sendStatus(500);
    })
})

module.exports = router;