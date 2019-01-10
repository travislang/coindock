const express = require('express');
const pool = require('./modules/pool');
const WebSocket = require('ws');
const webpush = require('./modules/web-push.module');

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

function heartbeat() {
    console.log('recieved ping from server');
}

function monitorAllPrices() {
    let ws = new WebSocket(`wss://stream.binance.com:9443/ws/!miniTicker@arr`);
    ws.on('open', () => {
        console.log('binance all minitickers stream open');
    });
    // send pong on ping to keep socket open
    ws.on('ping', heartbeat);
    //listen for data stream
    ws.on('message', function (data) {
        const prices = JSON.parse(data);
        // save response in global variable
        globalTickerPrices = prices;
    });
}

// get alerts to monitor from db
function getAlerts() {
    const sqlText = `SELECT "alerts".id, "alerts".price_threshold, "alerts".less_than, "symbols".symbol FROM "alerts"
    JOIN "symbols" ON "symbols".id = "alerts".symbol_id
    JOIN "person" ON "person".id = "alerts".person_id
    WHERE "person".global_alerts_on = true AND "alerts".alerts_on = true;`
    return pool.query(sqlText)
        .then(({ rows }) => {
            // save alerts into global variable
            globalAlerts = rows;
        })
}

// set interval to check prices every 3 seconds
function priceCheckInterval(alerts) {
    //sets interval
    intervalId = setInterval(() => {
        // filters coins against alerts to see if any alerts need to be sent
        const filteredCoins = alerts.filter(alert => {
            return globalTickerPrices.find(coin => {
                let testString = alert.less_than ? coin.c < alert.price_threshold : coin.c > alert.price_threshold
                return alert.symbol === coin.s && testString
            })
        })
        console.log('this is after filter', filteredCoins);
        if (filteredCoins.length > 0) {
            console.log('clearing interval');
            // clear the interval
            clearInterval(intervalId);
            triggerPushNotification(filteredCoins[0].id)
            // turn alerts off for alert that just got sent
            pool.query(`UPDATE "alerts" SET "alerts_on" = NOT "alerts_on" WHERE "id" = $1`, [filteredCoins[0].id])
                .then(() => {
                    // call getAlerts again to get new alerts
                    getAlerts();
                    // set new 3 second interval
                    priceCheckInterval(globalAlerts);
                })
        }
    }, 3000);
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