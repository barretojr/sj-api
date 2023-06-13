const database = require('../database/db')

const conn = database.connect();

const userModel = {
    create: async (user) => {
        const { username, name, email, password } = user;
        const [result] = await (await conn).query(`
        INSERT INTO users (username, name, email, password, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())`, [username, name, email, password]);
        (await conn).release;
        return result.insertId;
    },

    findById: async (id) => {
        const [rows] = await (await conn).query('SELECT * FROM users WHERE id = ?', [id]);
        (await conn).release;
        return rows[0];
    },

    findAll: async () => {
        const [rows] = await (await conn).query('SELECT * FROM users');
        (await conn).release;
        return rows;
    },

    update: async (id, user) => {
        const { username, name, email, password, updated_at } = user;
        await conn.execute(`UPDATE users
        SET username = ?, name = ?, email = ?, password = ?,  updated_at = TIMESTAMP
        WHERE id = ?`, [username, name, email, password, updated_at, id]);
        (await conn).release;
    },

    delete: async (id) => {
        const query = 'DELETE FROM users WHERE id = ?';
        await (await conn).query(query, [id]);
        (await conn).release;
    }

};

module.exports = userModel;
