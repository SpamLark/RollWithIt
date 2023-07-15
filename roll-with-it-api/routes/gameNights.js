const express = require('express');
const router = express.Router();
const gameNights = require('../services/gameNights');

/* GET game nights. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await gameNights.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting game nights `, err.message);
    next(err);
  }
});

module.exports = router;