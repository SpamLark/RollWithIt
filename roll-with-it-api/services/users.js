const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function createUser(user){
    const result = await db.query(
      `INSERT INTO users (user_id, email, is_admin)      
      VALUES
      ('${user.uid}', '${user.email}', 0)`
    );
  
    let message = 'Error in adding new user to database';
  
    if (result.affectedRows) {
      message = 'New user added to database';
    }
    return {message};
  }

  module.exports = {
    createUser
}