const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT game_night_id, game_night_location, game_night_datetime 
    FROM game_nights LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function create(gameNight){
  const result = await db.query(
    `INSERT INTO game_nights (game_night_location, game_night_datetime)      
    VALUES
    ('${gameNight.game_night_location}', '${gameNight.game_night_datetime}')`
  );

  let message = 'Error in creating game night';

  if (result.affectedRows) {
    message = 'Game night created successfully';
  }
  return {message};
}

module.exports = {
  getMultiple,
  create
}