const express = require("express");
const router = express.Router();
const database = require("../database/db");
const {
  getInvent,
  createInvent,
  updateInvent,
  deleteInvent,
} = require("../controllers/inventory.controller");

router.get("/", async (req, res) => {
  try {
    const listagem = await database.showInventory();
    res.json({ listagem });
  } catch (error) {
    res.status(500).send("Ocorreu um erro ao exibir os dados do servidor");
  }
});

router.get("/show/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const inventario = await getInvent(req, res, id);
    res.json({ listagem: inventario });
  } catch (error) {
    res.status(400);
  }
});

router.post("/register", async (req, res) => {
  const {
    patrimonio,
    unidade,
    descricao,
    modelo,
    localizacao,
    valorestim,
    usuario,
    nserie,
    data_compra,
  } = req.body;
  try {
    await createInvent(
      req,
      res,
      patrimonio,
      unidade,
      descricao,
      modelo,
      localizacao,
      valorestim,
      usuario,
      nserie,
      data_compra
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "ocorreu um erro ao registrar o inventario",
      error: error,
    });
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const {
    unidade,
    descricao,
    modelo,
    localizacao,
    valorestim,
    usuario,
    nserie,
    data_compra,
  } = req.body;
  try {
    await updateInvent(
      req,
      res,
      id,
      unidade,
      descricao,
      modelo,
      localizacao,
      valorestim,
      usuario,
      nserie,
      data_compra
    );
    return res.status(200);
  } catch (error) {
    return res.status(500);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteInvent(req, res, id);
    res.send("Inventário excluído com sucesso");
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
