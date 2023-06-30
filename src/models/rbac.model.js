const database = require("../database/mysqldb");
const conn = database.connect();

const rbac = {
  findRoleById: async (roleId) => {
    const [result] = await conn.execute("CALL FindRoleById(?)", [roleId]);
    (await conn).release()
    return result[0];

  },

  createRole: async (descricao) => {
    const [result] = await conn.execute("CALL CreateRole(?)", [descricao]);
    (await conn).release()
    return result[0].insertId;
  },

  findPermissionById: async (permissionId) => {
    const [result] = await conn.execute("CALL FindPermissionById(?)", [
      permissionId,
    ]);
    (await conn).release()
    return result[0];
  },

  createPermission: async (descricao) => {
    const [result] = await conn.execute("CALL CreatePermission(?)", [
      descricao,
    ]);
    (await conn).release()
    return result[0].insertId;
  },

  updateUserRole: async (user, role) => {
    const { userId } = user;
    const { roleId } = role;
    const [result] = await conn.execute("CALL UpdateUserRole(?, ?)", [
      userId,
      roleId,
    ]);
    (await conn).release()
    return result[0].affectedRows;
  },

  updateUserPermission: async (user, permission) => {
    const { userId } = user;
    const { permissionId } = permission;
    const [result] = await conn.execute("CALL UpdateUserPermission(?, ?)", [
      userId,
      permissionId,
    ]);
    (await conn).release()
    return result[0].affectedRows;
  },

  updatePermissionRole: async (permission, role) => {
    const { permissionId } = permission;
    const { roleId } = role;
    const [result] = await conn.execute("CALL UpdatePermissionRole(?, ?)", [
      permissionId,
      roleId,
    ]);
    (await conn).release()
    return result[0].affectedRows;
  }  
};

module.exports = rbac;
