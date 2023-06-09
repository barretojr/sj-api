const express = require("express");
const router = express.Router();

const {
  getfull,
  getInvent,
  createInvent,
  updateInvent,
  deleteInvent,
} = require("../controllers/inventory.controller");

router.get("/", async (req, res) => {
  try {
    await getfull(req, res);
  } catch (error) {
    console.log("erro na rota /", error);
    return res.status(500)
  }
});


router.get("/show/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const inventario = await getInvent(req, res, id);
    return res.json({ listagem: inventario });
  } catch (error) {
    return res.status(400);
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
    return res.status(500);
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
    return res.send("Inventário excluído com sucesso");
  } catch (error) {
    return res.status(500);
  }
});

module.exports = router;
