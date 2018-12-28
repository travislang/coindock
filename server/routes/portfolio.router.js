const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
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