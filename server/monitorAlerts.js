const express = require('express');
const pool = require('./modules/pool');
const router = express.Router();
const WebSocket = require('ws');
const webpush = require('./modules/web-push.module');
const pushRouter = require('./routes/push.router');

// monitor all alerts to send notifications
function monitorAlerts() {
    // get all alerts from db
    getAlerts()
    .then( response => {
        let ws = new WebSocket(`wss://stream.binance.com:9443/ws/!miniTicker@arr`);
        ws.on('open', () => {
            console.log('binance all symbols stream open');
        });
        // send pong on ping to keep socket open
        ws.on('ping', heartbeat);
        //listen for data stream
        ws.on('message', function (data) {
            const prices = JSON.parse(data);
            // filter coins to see if any match symbol name & broke price threshold
            const filteredCoins = response.filter( alert => {
                return prices.find( coin => {
                    let testString = alert.less_than ? coin.c < alert.price_threshold : coin.c > alert.price_threshold
                    return alert.symbol === coin.s && testString
                })
            })
            console.log('this is after filter', filteredCoins);
            if(filteredCoins.length > 0) {
                triggerPushNotification(filteredCoins[0].id)
            }
        });
    })
}

function heartbeat() {
    console.log('recieved ping from server');
}

function getAlerts() {
    const sqlText = `SELECT "alerts".id, "alerts".price_threshold, "alerts".less_than, "symbols".symbol FROM "alerts"
    JOIN "symbols" ON "symbols".id = "alerts".symbol_id
    JOIN "person" ON "person".id = "alerts".person_id
    WHERE "person".global_alerts_on = true AND "alerts".alerts_on = true;`
    return pool.query(sqlText)
        .then(({ rows }) => {
            return rows;
        })
}

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
        .then(() => {
            res.sendStatus(201);
        })
        .catch(err => {
            console.log('error in db query in trigger push call:', err);
            res.sendStatus(500);
        })
    const triggerPushMsg = function (subscription, dataToSend) {
        console.log('data to send', JSON.stringify(dataToSend))
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
}

module.exports = {
    monitorAlerts: monitorAlerts,
    getAlerts: getAlerts
}