const database = require('../database/db')

const conn = database.connect();

const userModel = {
    create: async (user) => {
        const { username, name, email, password } = user;
        const [result] = await (await conn).query(`
        INSERT INTO users (username, name, email, password, created_at, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, [username, name, email, password]);
        return result.insertId;
    },

    findById: async (id) => {
        const [rows] = await (await conn).query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    findAll: async () => {
        const [rows] = await (await conn).query('SELECT * FROM users');
        return rows[0];
    },

    update: async (id, user) => {
        const { username, name, email, password, updated_at } = user;
        const [result] = await (await conn).execute(`UPDATE users
        SET username = ?, name = ?, email = ?, password = ?,  update_at=CURRENT_TIMESTAMP
        WHERE id = ?`, [username, name, email, password, id]);
        return result.affectedRows;
    },

    updateOne: async (user) => {
        const { email, password } = user;
        const [result] = await (await conn).execute(`UPDATE users
        SET  password = ?,  update_at=CURRENT_TIMESTAMP
        WHERE email = ?`, [password, email]);
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await (await conn).execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    },

    closeConection: async () => {
        try {
            if (conn) {
                await (await conn).release;
            }
        } catch (error) {
            console.log('erro ao fechar conexão', error);
        }
    }
};

module.exports = userModel;
