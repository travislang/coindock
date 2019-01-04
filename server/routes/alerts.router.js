const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

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

router.put('/toggle-alert/:id', (req, res) => {
    pool.query(`UPDATE "alerts" SET "alerts_on" = NOT "alerts_on" WHERE "id" =               $1`, [req.params.id])
        .then(result => {
            res.sendStatus(201);
        })
        .catch(err => {
            console.log('error toggling alerts', err);
            res.sendStatus(500);
        })
})

// route to match order of list to user preferences.  Need to look at more for bugs
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
            client.release()
        }
    })().catch(e => console.log(e.stack))
    
})









module.exports = router;