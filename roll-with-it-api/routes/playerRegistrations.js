const express = require('express');
const router = express.Router();
const playerRegistrations = require('../services/playerRegistrations');

/*POST player registration */
router.post('/', async function(req, res, next) {
    try {
      console.log(req.body);
      res.json(await playerRegistrations.createPlayerRegistration(req.body));
    } catch (err) {
      console.error(`Error while creating player registration`, err.message);
      next(err);
    }
  });

  module.exports = router;