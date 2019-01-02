const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// get all alerts for a user
router.get('/', (req, res) => {
    pool.query(`SELECT "alerts".*, "symbols".logo, "symbols".symbol_name,                  "symbols".base_asset FROM "alerts"
                LEFT OUTER JOIN "symbols" ON "symbols".id = "alerts".symbol_id
                WHERE "alerts".person_id = $1;`, [req.user.id])
        .then( result => {
            res.send( result.rows )
        })
        .catch( err => {
            console.log('error getting alerts from DB', err);
            res.sendStatus(500);
        })
})









module.exports = router;