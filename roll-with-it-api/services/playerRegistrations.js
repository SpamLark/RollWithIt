const db = require('./db');

async function createPlayerRegistration(registrationDetails){
    const result = await db.query(
      `INSERT INTO player_registrations (user_id, game_instance_id)      
      VALUES
      (?, ?)`, [registrationDetails.uid, registrationDetails.game_instance_id]
    );
  
    let message = 'Error whilst recording player registration';
  
    if (result.affectedRows) {
      message = 'Player registration recorded';
    }
    return {message};
  }

module.exports = {
    createPlayerRegistration
}