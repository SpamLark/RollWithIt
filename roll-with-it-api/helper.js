const db = require('./services/db');

function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
  }
  
function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

/* Check admin privileges middleware */
const isAdminMiddleware = async (uid) => {
  try {
    const results =  await db.query(`SELECT is_admin FROM users WHERE user_id = '${uid}'`);
    const isAdmin = results[0].is_admin === 1;
    return isAdmin;
  } catch (err) {
    throw new Error('Database error occurred');
  }
}

/* Check user matches game instance host */
const isHostMiddleware = async (uid, game_instance_id) => {
  try {
    const results = await db.query(`SELECT host_id FROM game_instances WHERE game_instance_id = '${game_instance_id}'`);
    const isHost = results[0].host_id === uid;
    return isHost;
  } catch (err) {
    throw new Error('Database error occurred.');
  }
}

/* Check game instance capacity middleware */
const hasCapacityMiddleware = async (game_instance_id) => {
  try {
    const results = await db.query(
      `
      SELECT 
	      1 AS hasCapacity 
      FROM 
	      game_instances gi
      WHERE
	      gi.game_instance_id = ?
        AND gi.max_players > (
		      SELECT COUNT(*) 
          FROM player_registrations pr 
          WHERE pr.game_instance_id = gi.game_instance_id
        )
      `, [game_instance_id]
    );
    return results[0];
  } catch (err) {
    throw new Error('Database error occurred.');
  }
}
  
  module.exports = {
    getOffset,
    emptyOrRows,
    isAdminMiddleware,
    isHostMiddleware,
    hasCapacityMiddleware
  }