const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const monitorAlerts = require('../webSockets/monitorAlerts');
const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
    // Send back user object from the session (previously queried from the database)
    res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = encryptLib.encryptPassword(req.body.password);

    const queryText = 'INSERT INTO person (name, username, password) VALUES ($1, $2, $3) RETURNING id';
    pool.query(queryText, [name, username, password])
        .then(() => { res.sendStatus(201); })
        .catch((err) => { next(err); });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
    // Use passport's built-in method to log out the user
    req.logout();
    res.sendStatus(200);
});

router.put('/toggle-alerts', rejectUnauthenticated, (req, res) => {
    pool.query(`UPDATE "person" SET "global_alerts_on" = NOT "global_alerts_on" WHERE "id" =               $1`, [req.user.id])
        .then( result => {
            monitorAlerts.getAlerts();
            res.sendStatus(201);
        })
        .catch( err => {
            console.log('error toggling alerts', err);
            res.sendStatus(500);
        })
})

router.put('/clear-alert-count', (req, res) => {
    pool.query(`UPDATE "person" SET "alerts_total" = 0 WHERE "id" =$1`, [req.user.id])
    .then(() => {
        res.sendStatus(200);
    })
    .catch(err => {
        console.log('error clearing alerts count', err);
        res.sendStatus(500);
    })
})

module.exports = router;
