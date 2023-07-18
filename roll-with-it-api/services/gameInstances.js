const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getInstancesByGameNight(gameNight){
    const rows = await db.query(
        `SELECT 
            game_instance_id, 
            host_id, 
            game_name, 
            min_players, 
            max_players, 
            (SELECT COUNT(*) FROM player_registration pr WHERE pr.game_instance_id = gi.game_instance_id) AS num_players
        FROM 
            game_instance gi
        WHERE
            gi.game_night_id = ${gameNight.game_night_id}`
    );
    const data = helper.emptyOrRows(rows);
  
    return {
      data
    }
}

module.exports = {
    getInstancesByGameNight
}