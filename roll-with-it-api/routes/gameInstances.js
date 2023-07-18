const express = require('express');
const router = express.Router();
const gameNights = require('../services/gameInstances');

/* GET game instances by game night id */
router.get('/', async function(req, res, next) {
    try {
      res.json(await gameNights.getInstancesByGameNight(req.query));
    } catch (err) {
      console.error(`Error while getting game instances `, err.message);
      next(err);
    }
  });

module.exports = router;