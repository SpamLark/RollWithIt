const express = require('express');
const router = express.Router();
const users = require('../services/users');

/*POST users */
router.post('/', async function(req, res, next) {
    try {
      console.log(req.body);
      res.json(await users.createUser(req.body));
    } catch (err) {
      console.error(`Error while creating user`, err.message);
      next(err);
    }
  });

  module.exports = router;