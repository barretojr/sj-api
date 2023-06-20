const express = require("express");
const app = express();
const { eAdmin, eUser } = require("../middleware/eAuth");
const user = require("./user.route");
const home = require("./homeRoute");
const inventario = require("./inventory.route");
const setuser = require("./setuser.route");
const dashboard = require("./dashboard.route");
const rbac = require("./rbac.route");

app.use("/user", user);
app.use("/home", home);
app.use("/inventario",eAdmin, inventario);//precisa ser admin
app.use("/setuser", setuser);
app.use("/dashboard", eUser, dashboard);//precisa ser usuario padrão
app.use("/rbac", rbac); //precisa ser admin 

// Rota 404
app.use((req, res, next) => {
  res.status(404).redirect('/404')
});

module.exports = app;
