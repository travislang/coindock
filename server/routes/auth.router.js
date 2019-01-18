const express = require('express');
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();

//routes for facebook authorization
router.get('/facebook', userStrategy.authenticate('facebook'));

router.get('/facebook/return', userStrategy.authenticate('facebook'), (req, res) => {
    res.redirect('http://localhost:3000/');
});

module.exports = router;