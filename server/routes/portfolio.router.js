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
            
            res.send( result.rows )
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

router.get('/symbols/:id', (req, res) => {
    let id = req.params.id
    let sqlText = `SELECT "symbols".* FROM "symbols"
                    JOIN "portfolio_symbols" ON "symbols".id = "portfolio_symbols".symbol_id
                    JOIN "portfolio" ON "portfolio_symbols".portfolio_id = "portfolio".id
                    WHERE "portfolio".id = $1 AND "portfolio".person_id = $2;`
    pool.query(sqlText, [id, req.user.id])
    .then( result => {
        const symbols = result.rows && result.rows[0] ? result.rows : 'none'
        res.send( symbols )
    })
    .catch( err => {
        console.log('error getting portfolio symbols from db:', err);
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