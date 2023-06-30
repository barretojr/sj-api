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
    (await conn).release()
    return result[0].userId;
  },

  findById: async (id) => {
    const [rows] = await (await conn).query("CALL getUserById(?)", [id]);
    (await conn).release()
    return rows[0];
  },

  findAll: async () => {
    const [rows] = await (await conn).query("CALL getAllUsers()");
    (await conn).release()
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
    (await conn).release()
    return result[0].affectedRows;
  },

  updateToken: async (params) => {
    const { token, email } = params;
    const [result] = await (await conn).query("CALL updateToken(?, ?)", [
      token,
      email,
    ]);
    (await conn).release()
    return result[0].affectedRows;
  },

  listenToken: async (params) => {
    const { token, email } = params;
    const [result] = await (await conn).query("CALL getUserByTokenAndEmail(?, ?)", [
      token,
      email,
    ]);
    (await conn).release()
    return result[0];
  },

  updateOne: async (user) => {
    const { email, password } = user;
    const [result] = await (await conn).query("CALL updatePasswordByEmail(?, ?)", [
      email,
      password,
    ]);
    (await conn).release()
    return result[0].affectedRows;
  },

  delete: async (id) => {
    const [result] = await (await conn).query("CALL deleteUserById(?)", [id]);
    (await conn).release()
    return result[0].affectedRows;
  },
  
};

module.exports = userModel;
