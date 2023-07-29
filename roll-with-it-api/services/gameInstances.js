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

async function create(gameInstance){
    const result = await db.query(
      `INSERT INTO game_instance (host_id, game_night_id, game_name, min_players, max_players)      
      VALUES
      ('${gameInstance.host_id}', '${gameInstance.game_night_id}', '${gameInstance.game_name}', '${gameInstance.min_players}', '${gameInstance.max_players}')`
    );
  
    let message = 'Error in creating game instance';
  
    if (result.affectedRows) {
      message = 'Game instance created successfully';
    }
    return {message};
  }

module.exports = {
    getInstancesByGameNight,
    create
}