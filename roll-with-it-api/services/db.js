const mysql = require('mysql2/promise');
const config = require('../config');

const pool = mysql.createPool(config.db);

async function query(sql, params) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results, ] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  query
}