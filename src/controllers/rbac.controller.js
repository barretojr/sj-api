const rbac = require("../models/rbac.model");

async function setRole(req, res, role, descRole) {
  try {
    await rbac.createRole(role, descRole);
    res.status(200);
  } catch (error) {
    req.flash("msg_error", "Ocorreu um erro ao excluir o item");
    return res.status(500).json({
      message: "ocorreu um erro ao excluir o item",
    });
  } finally {
    await rbac.closeConnection();
  }
}

async function setPermission(req, res, permission, descPermission) {
  const fountList = await rbac.findPermissionById(permission);
  if (fountList) {
    return res.status().json({
      message: "Permissão ja cadastrada",
    });
  }
  try {
    await rbac.createPermission(permission, descPermission);

    res.status(200);
  } catch (error) {
    req.flash("msg_error", "Ocorreu um erro ao excluir o item");
    return res.status(500).json({
      message: "ocorreu um erro ao excluir o item",
    });
  } finally {
    await rbac.closeConnection();
  }
}

async function permissionRole(req, res, permission, role) {
  try {
    await rbac.permissionRole(permission, role);

    res.status(200);
  } catch (error) {
    req.flash("msg_error", "Ocorreu um erro ao excluir o item");
    return res.status(500).json({
      message: "ocorreu um erro ao excluir o item",
    });
  } finally {
    await rbac.closeConnection();
  }
}

async function userPermission(req, res, user, permission) {
  try {
    await rbac.updateUserPermission(user, permission);

    res.status(200);
  } catch (error) {
    req.flash("msg_error", "Ocorreu um erro ao excluir o item");
    return res.status(500).json({
      message: "ocorreu um erro ao excluir o item",
    });
  } finally {
    await rbac.closeConnection();
  }
}

async function roleUser(req, res, roles, users) {
  try {
    await rbac.updateUserRole(roles, users);

    res.status(200);
  } catch (error) {
    req.flash("msg_error", "Ocorreu um erro ao excluir o item");
    return res.status(500).json({
      message: "ocorreu um erro ao excluir o item",
    });
  } finally {
    await rbac.closeConnection();
  }
}

module.exports = {
  setRole,
  setPermission,
  permissionRole,
  userPermission,
  roleUser,
};
