const mysql = require('mysql2/promise');

let connection;

const getDBConnection = async () => {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "./Baymax2024",
        database: "otakuscope",
      });
    }
    return connection;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

// Function to check if the connection is alive
const checkConnection = async () => {
  try {
    const conn = await getDBConnection();
    await conn.ping();
    console.log("Database connection is active.");
  } catch (err) {
    console.error("Database connection is not active:", err);
  }
};

module.exports = { getDBConnection, checkConnection };
