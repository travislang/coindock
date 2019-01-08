const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const webpush = require('../modules/web-push.module');


// saves users push subscription to db
router.post('/save-subscription', (req, res) => {
    console.log('hit sav sub route', req.body);
    if (!req.body || !req.body.endpoint) {
        res.sendStatus(400);
    }
    else {
        const sqlText = `UPDATE "person" SET "push_endpoint" = $1, "p256dh" = $2, "auth" = $3 WHERE "id" = $4;`
        pool.query(sqlText, [req.body.endpoint, req.body.keys.p256dh, req.body.keys.auth, req.user.id])
            .then(result => {
                res.sendStatus(201);
            })
            .catch(err => {
                console.log('error saving push sub to db', err);
                res.sendStatus(500);
            })
    }
});

router.post('/trigger-push/:id', function (req, res) {
    const alertId = req.params.id;
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
    .then( () => {
        res.sendStatus(201);
    })
    .catch( err  => {
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
})

module.exports = router;