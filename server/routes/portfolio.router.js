const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
//get all portfolios owned by user
router.get('/', (req, res) => {
    pool.query(`SELECT * FROM "portfolio"
                WHERE "person_id" = $1`, [req.user.id])
    .then( result => {
        const portfolios = result && result.rows && result.rows[0];
        console.log('portfolios', portfolios);
        //user has portfolios -- send them back
        if (portfolios) {
            console.log('sent back');
            
            res.send( portfolios )
        }
        //user doesnt have any portfolios yet -- create one
        else if (!portfolios) {
            pool.query(`INSERT INTO "portfolio"("person_id")
                        VALUES($1) RETURNING *;`, [req.user.id])
            .then( result => {
                console.log(result.rows);
                res.send( result.rows )
            })
        }
    })
    .catch( err => {
        console.log('error getting portfolios from DB:', err);
        res.sendStatus(500);
    })
})

router.post('/add:id', (req, res) => {
    pool.query(`INSERT INTO "portfolio_symbols"("symbol_id", "portfolio_id")
                VALUES($1, $2);`)
});

/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;