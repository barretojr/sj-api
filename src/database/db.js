require("dotenv").config();

async function connect() {
  try {
    const mysql = require("mysql2/promise");
    const connectionPool = await mysql.createPool({
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

async function showInventory() {
  let conn;
  try {
    conn = await connect();
    const [rows] = await conn.execute("SELECT * FROM Inventario");
    rows.forEach((row) => {
      if (row.data_compra !== null) {
        const dateValue = row.data_compra.toISOString();
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        row.formattedDataCompra = new Date(dateValue).toLocaleDateString(
          "pt-BR",
          options
        );
      } else {
        row.formattedDataCompra = "Sem data";
      }
    });
    return rows;
  } catch (error) {
    console.error("Erro ao mostrar o inventário", error);
    throw error;
  } finally {
    if (conn) {
      await (await conn).release();
    }
  }
}

module.exports = {
  connect,
  showInventory: showInventory,
};
