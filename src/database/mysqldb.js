require("dotenv").config();
const mysql = require("mysql2/promise");

let connectionPool;

async function connect() {
  try {
    connectionPool =  mysql.createPool({
      host: process.env.DB_URL,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      connectionLimit: 10,
      namedPlaceholders: true,
      timezone: "-03:00",
    });
    const connection = await connectionPool.getConnection();
    return connection;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados: ", error);
    throw error;
  }
}

async function release(connection) {
  if (connection) {
    connection.release();
  }
}

module.exports = {
  connect,
  release,
};
