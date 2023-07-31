const db = require('./db');

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

async function getUserById(uid){
  const accountInfo = await db.query(
    `SELECT
      user_id,
      username,
      is_admin
    FROM 
      users
    WHERE
      users.user_id = '${uid}'`
  );
}

async function updateUserProfile(uid, accountInfo){
  const result = await db.query(
    `UPDATE users
    SET
      username='${accountInfo.username}',
      is_admin='${accountInfo.isAdmin}'
    WHERE
      user_id = '${uid}'`
  );
  let message = 'Error updating user';
  
  if (result.affectedRows) {
    message = 'User updated';
  }
  return {message};
}

  module.exports = {
    createUser,
    getUserById,
    updateUserProfile
}