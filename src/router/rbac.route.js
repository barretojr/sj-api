const express = require("express");
const router = express.Router();
const {
  setRole,
  setPermission,
  permissionRole,
  userPermission,
  roleUser,
} = require("../controllers/rbac.controller");

router.post("/set/permission", async (req, res) => {
  const { permissionId, descPermission } = req.body;
  try {
    await setPermission(req, res, permissionId, descPermission);
  } catch (error) {
    console.log("erro na rota/ setpermission", error);
    return res.status(500);
  }
});

router.post("/set/role", async (req, res) => {
  const { roleId, descRole } = req.body;

  try {
    await setRole(req, res, roleId, descRole);
  } catch (error) {
    console.log("erro na rota/ setuser");
    return res.status(500);
  }
});

router.post("/set/rolepermission", async (req, res) => {
  const { roleId, permissionId } = req.body;

  try {
    await permissionRole(req, res, roleId, permissionId);
  } catch (error) {
    console.log("erro na rota/ rolepermission");
    return res.status(500);
  }
});

router.post("/set/permissionuser", async (req, res) => {
  const { permissionId, userId } = req.body;

  try {
    await userPermission(req, res, permissionId, userId);
  } catch (error) {
    console.log("erro na rota/ permissionuser");
    return res.status(500);
  }
});

router.post("/set/roleuser", async (req, res) => {
  const { userId, roleId } = req.body;

  try {
    await roleUser(req, res, userId, roleId);
  } catch (error) {
    console.log("erro na rota/ roleuser");
    return res.status(500);
  }
});

module.exports = router;
