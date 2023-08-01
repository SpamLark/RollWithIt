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
  console.log(uid);
  try {
    const results =  await db.query(`SELECT is_admin FROM users WHERE user_id = '${uid}'`);
    console.log(results[0]);
    const isAdmin = results[0].is_admin === 1;
    console.log(isAdmin);
    return isAdmin;
  } catch (err) {
    throw new Error('Database error occurred')
  }
}
  
  module.exports = {
    getOffset,
    emptyOrRows,
    isAdminMiddleware
  }