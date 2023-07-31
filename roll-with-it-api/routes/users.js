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

  /*GET user by uid */
  router.get('/:uid', async function(req, res, next) {
    try {
      res.json(await users.getUserById(req.params.uid));
    } catch (err) {
      console.error(`Error while getting account info`, err.message);
      next(err);
    }
  });

  /*PUT user info by uid */
  router.put('/:uid', async function(req, res, next) {
    try {
      res.json(await users.updateUserProfile(req.params.uid, req.body))
    } catch (err) {
      console.error(`Error while updating user. `, err.message);
      next(err);
    }
  });

  module.exports = router;