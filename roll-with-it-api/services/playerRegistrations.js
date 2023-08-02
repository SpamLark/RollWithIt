const db = require('./db');
const helper = require('../helper');

async function createPlayerRegistration(registrationDetails){

  const hasCapacity = await helper.hasCapacityMiddleware(registrationDetails.game_instance_id);

  if (!hasCapacity) {
    return {status: 409, message: 'This game is currently full.'};
  }

  const result = await db.query(
    `INSERT INTO player_registrations (user_id, game_instance_id)      
    VALUES
    (?, ?)`, [registrationDetails.uid, registrationDetails.game_instance_id]
  );

  let message = 'Error whilst recording player registration';

  if (result.affectedRows) {
    return {status: 200, message: 'Player registration recorded'};
  }
  return {message};
}

module.exports = {
    createPlayerRegistration
}