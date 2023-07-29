const express = require('express');
const router = express.Router();
const gameInstances = require('../services/gameInstances');

/* GET game instances by game night id */
router.get('/', async function(req, res, next) {
  try {
    res.json(await gameInstances.getInstancesByGameNight(req.query));
  } catch (err) {
    console.error(`Error while getting game instances `, err.message);
    next(err);
  }
});

/*POST game instance. */
router.post('/', async function(req, res, next) {
  try {
    console.log(req.body);
    res.json(await gameInstances.create(req.body));
  } catch (err) {
    console.error(`Error while creating game instance`, err.message);
    next(err);
  }
});

module.exports = router;