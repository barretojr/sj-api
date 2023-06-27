const database = require('../database/mysqldb')

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
    ).execute(
      `INSERT INTO Inventario
         (patrimonio, unidade, descricao, modelo, localizacao, valorestim, usuario, nserie, data_compra, create_at, update_at) 
         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `,
      [
        patrimonio,
        unidade,
        descricao,
        modelo,
        localizacao,
        valorestim,
        usuario,
        nserie,
        data_compra,
      ]
    );
    return result.insertId;
  },

  showAll: async () => {
    const [rows] = await (await conn).execute('SELECT * FROM Inventario');
    const formattedRows = rows.map((row) => {
      if (row.data_compra !== null) {
        const formattedDataCompra = new Date(row.data_compra).toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        return { ...row, formattedDataCompra };
      } else {
        return { ...row, data_compra: 'Sem data' };
      }
    });
    return formattedRows;
  },
  

  findById: async (idpatrimonio) => {
    const [rows] = await (
      await conn
    ).query("SELECT * FROM Inventario WHERE patrimonio = ?", [idpatrimonio]);
    return rows[0];
  },

  findAll: async () => {
    const [rows] = await (await conn).query("SELECT * FROM Inventario");
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
    ).execute(
      `UPDATE Inventario SET unidade=?, descricao=?, modelo=?, localizacao=?, valorestim=?, usuario=?,
             nserie=?, data_compra=?, update_at=CURRENT_TIMESTAMP WHERE patrimonio=?;`,
      [
        unidade,
        descricao,
        modelo,
        localizacao,
        valorestim,
        usuario,
        nserie,
        data_compra,
        id,
      ]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await (
      await conn
    ).execute("DELETE FROM Inventario WHERE patrimonio = ?", [id]);
    return result.affectedRows;
  },

  closeConection: async () => {
    try {
      if (conn) {
        await (
          await conn
        ).release;
      }
    } catch (error) {
      console.log("erro ao fechar conexão", error);
    }
  },
};

module.exports = inventModel;
