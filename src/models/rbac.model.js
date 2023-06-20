const database = require("../database/db");

const conn = database.connect();

const rbac = {
  findRoleById: async (roleId) => {
    const { role } = roleId;
    const [result] = await (
      await conn
    ).execute(`SELECT * FROM roles WHERE roleId = ?;`, [role]);
    return result[0];
  },

  createRole: async (descricao) => {
    const { desc } = descricao;
    const [result] = await (
      await conn
    ).execute(`INSERT INTO roles (descricao) VALUES(?);`, [desc]);
    return result.insertId;
  },

  findPermissionById: async (permissionId) => {
    const { permission } = permissionId;
    const [result] = await (
      await conn
    ).execute(`SELECT * FROM permission WHERE permissionId = ?`, [permission]);
    return result[0];
  },

  createPermission: async (descricao) => {
    const { desc } = descricao;
    const [result] = await (
      await conn
    ).execute(`INSERT INTO permission (descricao) VALUES(?);`, [desc]);
    return result.insertId;
  },

  updateUserRole: async (user, role) => {
    const { userId } = user;
    const { roleId } = role;
    const [result] = await (
      await conn
    ).execute(
      `UPDATE roles_users SET roleId=?, userId=?;
    `,
      [userId, roleId]
    );
    return result.affectedRows;
  },

  updateUserPermission: async (user, permission) => {
    const { userId } = user;
    const { permissionId } = permission;
    const [result] = await (
      await conn
    ).execute(
      `UPDATE users_permission SET userId=?, permissionId=?;
    `,
      [userId, permissionId]
    );
    return result.affectedRows;
  },

  updatePermissionRole: async (permission, role) => {
    const { roleId } = role;
    const { permissionId } = permission;
    const [result] = await (
      await conn
    ).execute(
      `UPDATE permission_roles SET permissionId=?, rolesId=?;
    `,
      [permissionId, roleId]
    );
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

module.exports = rbac;
