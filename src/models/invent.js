const database = require('../database/db');

const conn = database.connect();

const inventModel = {
    create: async (idpatrimonio) => {
        const { patrimonio, unidade, descricao, modelo, localizacao, valorestim, usuario, nserie, data_compra } = idpatrimonio;
        const [result] = await (await conn).execute(`INSERT INTO Inventario
         (patrimonio, unidade, descricao, modelo, localizacao, valorestim, usuario, nserie, data_compra, create_at, update_at) 
         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `, [patrimonio, unidade, descricao, modelo, localizacao, valorestim, usuario, nserie, data_compra]);
        (await conn).release;// Adicionado parênteses para invocar o método release
        return result.insertId;
    },

    findById: async (idpatrimonio) => {
        const [rows] = await (await conn).query('SELECT * FROM Inventario WHERE patrimonio = ?', [idpatrimonio]);
        (await conn).release;// Adicionado parênteses para invocar o método release
        return rows[0];
    },

    findAll: async () => {
        const [rows] = await (await conn).query('SELECT * FROM Inventario');
        (await conn).release;// Adicionado parênteses para invocar o método release
        return rows[0];
    },

    update: async (id, newData) => {
        const { unidade, descricao, modelo, localizacao, valorestim, usuario, nserie, data_compra } = newData;
        const [result] = await (await conn).execute(
            `UPDATE Inventario SET unidade=?, descricao=?, modelo=?, localizacao=?, valorestim=?, usuario=?,
             nserie=?, data_compra=?, update_at=CURRENT_TIMESTAMP WHERE patrimonio=?;`,
            [unidade, descricao, modelo, localizacao, valorestim, usuario, nserie, data_compra, id]
        );
        (await conn).release;// Adicionado parênteses para invocar o método release
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await conn.query('DELETE FROM Inventario WHERE patrimonio = ?', [id]);
        (await conn).release;// Adicionado parênteses para invocar o método release
        return result.affectedRows;
    }
}

module.exports = inventModel;

