const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const axios = require('axios');
const router = express.Router();

router.post('/klines', (req, res) => {
    // time in ms
    let endTime = Date.now();
    // time in ms minus 7 days
    let startTime = endTime - 604800000;
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
    pool.query(`SELECT * FROM "symbols" ORDER BY "id" ASC LIMIT 20 OFFSET $1;`, [amount])
    .then( result => {
        res.send(result.rows)
    })
    .catch(err => {
        console.log('error getting all tickers from DB', err);
        res.send(500);
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