const express = require('express');
const router = express.Router();
const playerRegistrations = require('../services/playerRegistrations');

/*POST player registration */
router.post('/', async function(req, res, next) {
    try {
      console.log(req.body);
      const result = await playerRegistrations.createPlayerRegistration(req.body);
      if (result.status === 200) {
        res.status(200).json({message: result.message});
      } else if (result.status === 409) {
        res.status(409).json({message: result.message});
      } else {
        res.status(500).json({message: result.message});
      }
    } catch (err) {
      console.error(`Error while creating player registration`, err.message);
      next(err);
    }
  });

  module.exports = router;