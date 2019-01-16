const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const monitorAlerts = require('../webSockets/monitorAlerts');

// get all alerts for a user
router.get('/', (req, res) => {
    pool.query(`SELECT "alerts".*, "symbols".logo,           "symbols".symbol_name, "symbols".base_asset FROM "alerts"
                LEFT OUTER JOIN "symbols" ON "symbols".id = "alerts".symbol_id
                WHERE "alerts".person_id = $1
                ORDER BY "alerts".order ASC;`, [req.user.id])
        .then( result => {
            res.send( result.rows )
        })
        .catch( err => {
            console.log('error getting alerts from DB', err);
            res.sendStatus(500);
        })
})

router.post('/add', (req, res) => {
    const data = req.body;
    const dir = req.body.direction === 'true' ? true : false;
    pool.query(`INSERT INTO "alerts" ("person_id", "price_threshold", "less_than", "symbol_id")
                VALUES($1, $2, $3, $4)`, [req.user.id, data.price, dir, data.coinId])
        .then( () => {
            monitorAlerts.getAlerts();
            res.sendStatus(201);
        })
        .catch( err => {
            console.log('error adding alert to DB', err);
            res.sendStatus(500);
        })
})

router.delete('/', (req, res) => {
    pool.query(`DELETE FROM "alerts" WHERE "person_id" = $1`, [req.user.id])
    .then(() => {
        monitorAlerts.getAlerts();
        res.sendStatus(200);
    })
    .catch(err => {
        console.log('error deleting all user alerts', err);
        res.sendStatus(500);
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    pool.query(`DELETE FROM "alerts" WHERE "id" = $1 AND "person_id" = $2`, [id, req.user.id])
    .then( () => {
        monitorAlerts.getAlerts();
        res.sendStatus(200);
        
    })
    .catch( err => {
        console.log('error deleting alert from db', err);
        res.sendStatus(500);
    })
})

// resets date sent of alert to null
router.put('/remove-chip/:id', (req, res) => {
    const alertId = req.params.id;
    pool.query(`UPDATE "alerts" SET "alert_sent" = null WHERE "id" = $1`, [alertId])
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.log('error deleting alert sent from db', err);
            res.sendStatus(500);
        })
})

router.put('/toggle-alert/:id', (req, res) => {
    pool.query(`UPDATE "alerts" SET "alerts_on" = NOT "alerts_on" WHERE "id" =               $1`, [req.params.id])
        .then(() => {
            monitorAlerts.getAlerts();
            res.sendStatus(201);
        })
        .catch(err => {
            console.log('error toggling alerts', err);
            res.sendStatus(500);
        })
})

// route to match order of list to user preferences.  Need to look at more for bugs
// need to refactor to use either async/await for promises - not both
router.put('/update-order', (req, res) => {
    console.log('in put:', req.body.data);
    const coins = req.body.data;
    (async () => {
        const client = await pool.connect()
        try {
            await Promise.all(
                coins.map( async (coin, i) => {
                    await client.query(`UPDATE "alerts" SET "order" = $1 WHERE "id" = $2 AND "person_id" = $3;`, [i + 1, coin.id, req.user.id])
                    console.log('in map');
                    
                })
            )
            console.log('responseArr', coins)
        } finally {
            console.log('done')
            res.sendStatus(200);
            client.release();
        }
    })().catch(e => {
        console.log(e.stack);
        res.sendStatus(500);
    })
    
})

module.exports = router;