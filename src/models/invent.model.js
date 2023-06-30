const database = require("../database/mysqldb");

const conn = database.connect();

const inventModel = {
  create: async (idpatrimonio) => {
    const {
      patrimonio,
      unidade,
      descricao,
      modelo,
      localizacao,
      valorestim,
      usuario,
      nserie,
      data_compra,
    } = idpatrimonio;
    const [result] = await (
      await conn
    ).query("CALL createInventory(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      patrimonio,
      unidade,
      descricao,
      modelo,
      localizacao,
      valorestim,
      usuario,
      nserie,
      data_compra,
    ]);
    (await conn).release()
    return result[0].inventoryId;
  },

  showAll: async () => {
    const [rows] = await (await conn).query("CALL getAllInventory()");
    (await conn).release()
    return rows;
  },

  findById: async (idpatrimonio) => {
    const [rows] = await (
      await conn
    ).query("CALL getInventoryById(?)", [idpatrimonio]);
    (await conn).release()
    return rows[0];
  },

  findAll: async () => {
    const [rows] = await (await conn).query("CALL bdsj.getAllInventory()");
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
    (await conn).release()
    return rows[0];
  },

  update: async (id, newData) => {
    const {
      unidade,
      descricao,
      modelo,
      localizacao,
      valorestim,
      usuario,
      nserie,
      data_compra,
    } = newData;
    const [result] = await (
      await conn
    ).query("CALL updateInventory(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      id,
      unidade,
      descricao,
      modelo,
      localizacao,
      valorestim,
      usuario,
      nserie,
      data_compra,
    ]);
    (await conn).release()
    return result[0].affectedRows;
  },

  delete: async (id) => {
    const [result] = await (await conn).query("CALL deleteInventory(?)", [id]);
    (await conn).release()
    return result[0].affectedRows;
  }
};

module.exports = inventModel;
