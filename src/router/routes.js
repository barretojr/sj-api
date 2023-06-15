const express = require("express");
const app = express();
const {eAdmin, eUser} = require("../middleware/eAuth")
const user = require("./user.route");
const home = require("./homeRoute");
const inventario = require("./inventory.route");


app.use("/user", user);
app.use("/home", home);
app.use("/inventario", eAdmin, inventario);

// Rota 404
app.use((req, res, next) => {
  res.status(404).send("Página não encontrada");
});

module.exports = app;
