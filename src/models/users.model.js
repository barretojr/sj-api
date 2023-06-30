const database = require("../database/mysqldb");

const conn = database.connect();

const userModel = {
  create: async (user) => {
    const { username, name, email, password } = user;
    const [result] = await (await conn).query("CALL createUser(?, ?, ?, ?)", [
      username,
      name,
      email,
      password,
    ]);
    return result[0].userId;
  },

  findById: async (id) => {
    const [rows] = await (await conn).query("CALL getUserById(?)", [id]);
    return rows[0];
  },

  findAll: async () => {
    const [rows] = await (await conn).query("CALL getAllUsers()");
    return rows;
  },

  update: async (id, user) => {
    const { username, name, email, password } = user;
    const [result] = await (await conn).query("CALL updateUser(?, ?, ?, ?, ?)", [
      id,
      username,
      name,
      email,
      password,
    ]);
    return result[0].affectedRows;
  },

  updateToken: async (params) => {
    const { token, email } = params;
    const [result] = await (await conn).query("CALL updateToken(?, ?)", [
      token,
      email,
    ]);
    return result[0].affectedRows;
  },

  listenToken: async (params) => {
    const { token, email } = params;
    const [result] = await (await conn).query("CALL getUserByTokenAndEmail(?, ?)", [
      token,
      email,
    ]);
    return result[0];
  },

  updateOne: async (user) => {
    const { email, password } = user;
    const [result] = await (await conn).query("CALL updatePasswordByEmail(?, ?)", [
      email,
      password,
    ]);
    return result[0].affectedRows;
  },

  delete: async (id) => {
    const [result] = await (await conn).query("CALL deleteUserById(?)", [id]);
    return result[0].affectedRows;
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

module.exports = userModel;
