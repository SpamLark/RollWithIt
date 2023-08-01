const db = require('./db');
const helper = require('../helper');

async function getInstancesByGameNight(gameNight){
    const rows = await db.query(
        `SELECT 
            game_instance_id, 
            COALESCE(username, email) AS host_id,
            game_name, 
            min_players, 
            max_players, 
            (SELECT COUNT(*) FROM player_registrations pr WHERE pr.game_instance_id = gi.game_instance_id) AS num_players
        FROM 
            game_instances gi
            JOIN users ON gi.host_id = users.user_id
        WHERE
            gi.game_night_id = ${gameNight.game_night_id}`
    );
    const data = helper.emptyOrRows(rows);
  
    return {
      data
    }
}

async function createGameInstance(gameInstance){
    const result = await db.query(
      `INSERT INTO game_instances (host_id, game_night_id, game_name, min_players, max_players)      
      VALUES
      ('${gameInstance.host_id}', '${gameInstance.game_night_id}', '${gameInstance.game_name}', '${gameInstance.min_players}', '${gameInstance.max_players}')`
    );
  
    let message = 'Error in creating game instance';
    let gameInstanceId = null;
  
    if (result.affectedRows) {
      message = 'Game instance created successfully';
      gameInstanceId = result.insertId;
    }
    return {message, game_instance_id: gameInstanceId};
  }

async function removeGameInstance(gameInstanceId){
  const result1 = await db.query(
    `DELETE FROM player_registrations WHERE game_instance_id = '${gameInstanceId}'`
  );

  const result2 = await db.query(
    `DELETE FROM game_instances WHERE game_instance_id = '${gameInstanceId}'`
  )

  let message = 'Error deleting game instance';

  if (result1.affectedRows && result2.affectedRows) {
    message = 'Game instance deleted successfully';
  }
  return {message};
}

module.exports = {
    getInstancesByGameNight,
    createGameInstance,
    removeGameInstance
}