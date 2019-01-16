const express = require('express');
const pool = require('../modules/pool');
const WebSocket = require('ws');
const webpush = require('../modules/web-push.module');
const moment = require('moment');

// current price of BTC and ETH -- needed to convert price to USD
let btcPrice;
let ethPrice;
// global variable to hold coin prices
let globalTickerPrices = [];
// global variable to hold alerts to check against coin prices
let globalAlerts = [];

// monitor all alerts to send notifications
function monitorAlerts() {
    // starts a websocket to get price data
    monitorAllPrices();
    // get all alerts from db
    getAlerts();
    // start 3 second interval to check coin prices
    priceCheckInterval(globalAlerts);
}

function monitorAllPrices() {
    let pingTimeout;
    // opens new webSocket to monitor prices
    let ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethbtc@ticker/!miniTicker@arr`);
    ws.on('open', function () {
        console.log('binance monitorPrices stream open');
        // clears heartbeat timeout
        clearTimeout(pingTimeout);
        // starts another heartbeat for 3mins + 10 seconds for latency
        pingTimeout = setTimeout(() => {
            console.log('pingTimeout hit, disconnecting...');
            ws.terminate();
        }, 300000 + 10000);
    });
    // send pong on ping to keep socket open
    ws.on('ping', () => {
        console.log('recieved ping from API in monitorPrices stream');
        ws.pong();
        // clears heartbeat timeout
        clearTimeout(pingTimeout);
        // starts another heartbeat for 3mins + 10 seconds for latency
        pingTimeout = setTimeout(() => {
            console.log('pingTimeout hit, disconnecting...');
            ws.terminate();
        }, 300000 + 10000);
    });
    //listen for data stream
    ws.on('message', function (data) {
        const dataObj = JSON.parse(data)
        if (dataObj.stream === '!miniTicker@arr') {
            // save response in global variable
            globalTickerPrices = dataObj.data;
        }
        else if (dataObj.stream === 'btcusdt@ticker') {
            btcPrice = dataObj.data.c
        }
        else if (dataObj.stream === 'ethbtc@ticker') {
            ethPrice = dataObj.data.c
        }
        
    });
    ws.on('close', function (code, reason) {
        console.log('monitorPrices stream closed, error:', code, reason);
        // clears heartbeat interval
        clearTimeout(pingTimeout);
        // if socket disconnects try to reconnect
        setTimeout(() => {
            console.log('trying to reconnect to monitorPrices stream...');
            monitorAllPrices();
        }, 1000);
    });
    ws.on('error', (err) => {
        console.log('error in monitorPrices websocket:', err);
    })
}

// get alerts to monitor from db
function getAlerts() {
    const sqlText = `SELECT "alerts".id, "alerts".price_threshold, "alerts".less_than, "symbols".symbol, "symbols".quote_asset, "person".id AS person_id FROM "alerts"
    JOIN "symbols" ON "symbols".id = "alerts".symbol_id
    JOIN "person" ON "person".id = "alerts".person_id
    WHERE "person".global_alerts_on = true AND "alerts".alerts_on = true;`
    return pool.query(sqlText)
    .then(({ rows }) => {
        // save alerts into global variable
        globalAlerts = rows;
    })
    .catch( err => {
        console.log('error getting alerts from DB', err);
        
    })
}

// set interval to check prices every 3 seconds
function priceCheckInterval(alerts) {
    //sets interval
    intervalId = setInterval(() => {
        //find alert matches
        const alertMatches = globalAlerts.filter(alert => {
            let temp = globalTickerPrices.find(coin => {
                return alert.symbol === coin.s
            })
            if(temp) {
                // add current price to alert object
                alert.last_price = temp.c;
                return true;
            }
        })
        if(alertMatches.length > 0) {
            // convert current price to usd
            const convertedPrices = globalAlerts.map(coin => {
                return convertToUsd(coin)
            })
            // filters coins against alerts to see if any alerts need to be sent
            const filteredCoins = convertedPrices.filter(alert => {
                let testString = alert.less_than ? alert.usd_price < alert.price_threshold : alert.usd_price > alert.price_threshold
                return testString;
            })
            // if a coin matches update db and send push alert
            if (filteredCoins.length > 0) {
                let date = moment().format('MMM Do @ h:mma');
                console.log('this is filtered coin obj', filteredCoins[0]);
                
                console.log('clearing interval');
                // clear the interval
                clearInterval(intervalId);
                triggerPushNotification(filteredCoins[0].id)
                // turn alerts off for alert that just got sent and attach alert time
                pool.query(`UPDATE "alerts" SET "alerts_on" = NOT "alerts_on", "alert_sent" = $1 WHERE "id" = $2`, [date, filteredCoins[0].id])
                    .then((res) => {
                        return res;
                    })
                    .then(() => {
                        // updates user db alerts total needed for badges
                        return pool.query(`UPDATE "person" SET "alerts_total" = "alerts_total" + 1 WHERE "id" = $1`, [filteredCoins[0].person_id])
                    })
                    .then(() => {
                        // call getAlerts again to get new alerts
                        getAlerts();
                        // set new 3 second interval
                        priceCheckInterval(globalAlerts);
                    })
                    .catch( err => {
                        console.log('error updating alerts in monitorAlerts', err);
                    })
            }
        }
    }, 3000);
}

function convertToUsd(coin) {
    let btc = btcPrice;
    let eth = btc * ethPrice;
    if (coin.quote_asset === 'BTC') {
        return {
            ...coin,
            usd_price: btc * coin.last_price
        }
    }
    else if (coin.quote_asset === 'USDT') {
        return {
            ...coin,
            usd_price: coin.last_price,
        }
    }
    else if (coin.quote_asset === 'ETH') {
        let usdPrice = eth * coin.last_price;
        return {
            ...ticker,
            usd_price: usdPrice,
        }
    }
}

//get subscription data for user attached to alert that got triggered
function triggerPushNotification(alertId) {
    pool.query(`SELECT "alerts".*, "person".push_endpoint, "person".p256dh, "person".auth, "symbols".symbol_name FROM "alerts"
    JOIN "person" ON "person".id = "alerts".person_id
    JOIN "symbols" ON "symbols".id = "alerts".symbol_id
    WHERE "alerts".id = $1;`, [alertId])
        .then((subscriptions) => {
            let promiseChain = Promise.resolve();
            for (let i = 0; i < subscriptions.rows.length; i++) {
                let subscription = subscriptions.rows[i];
                const subscriptionObj = {
                    endpoint: subscriptions.rows[i].push_endpoint,
                    keys: {
                        auth: subscriptions.rows[i].auth,
                        p256dh: subscriptions.rows[i].p256dh
                    }
                };
                const dataToSend = {
                    coin: subscription.symbol_name,
                    direction: subscription.less_than ? 'less than' : 'more than',
                    threshold: subscription.price_threshold
                }

                promiseChain = promiseChain.then(() => {
                    return triggerPushMsg(subscriptionObj, dataToSend);
                });
            }
            return promiseChain;
        })
        .catch(err => {
            console.log('error in db query in trigger push call:', err);
        })
}

// send push notification with data
function triggerPushMsg(subscription, dataToSend) {
    console.log('in trigger push data to send', JSON.stringify(dataToSend))
    return webpush.sendNotification(subscription, JSON.stringify(dataToSend))
        .catch((err) => {
            if (err.statusCode === 410) {
                console.log('in err 410')
                // return deleteSubscriptionFromDatabase(subscription._id);
            } else {
                console.log('Subscription is no longer valid: ', err);
            }
        });
};

module.exports = {
    monitorAlerts: monitorAlerts,
    getAlerts: getAlerts
}