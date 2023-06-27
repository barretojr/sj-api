const inventModel =require ("../models/invent.model");

const getfull = async (req, res) => {
  try {
    const foundInvent = await inventModel.showAll();
    if (!foundInvent) {
      req.flash("msg_error", "Erro ao listar inventario");
      return res.status(400).json({
        message: "Não foi possivel encontar o inventario",
      });
    }
    res.json({ listagem: foundInvent });
  } catch (error) {
    req.flash("msg_error", "Ocorreu um erro");
    return res.status(500).json({
      message: "erro ao listar",
    });
  } finally {
    await inventModel.closeConection();
  }
};

const getInvent = async (req, res, patrimonio) => {
  try {
    const foundInvent = await inventModel.findById(patrimonio);
    if (!foundInvent) {
      return res.status(400).json({
        message: "item não encontrado",
      });
    }
    res.json({ listagem: foundInvent });
  } catch (error) {
    req.flash("msg_error", "Ocorreu um erro");
    return res.status(500).json({
      message: "item não encontrado",
    });
  } finally {
    await inventModel.closeConection();
  }
};

const createInvent = async (
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
) => {
  const foundInvent = await inventModel.findById(patrimonio);
  if (foundInvent) {
    return res.status(400).json({ message: "item já cadastrado" });
  }
  const valorestimNum = Number(
    valorestim.replace(/[^\d.,]/g, "").replace(",", ".")
  );
  const parts = data_compra.split("/");
  const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
  const invent = {
    patrimonio: patrimonio,
    unidade: unidade,
    descricao: descricao,
    modelo: modelo,
    localizacao: localizacao,
    valorestim: valorestimNum,
    usuario: usuario,
    nserie: nserie,
    data_compra: formattedDate,
  };
  try {
    await inventModel.create(invent);
    req.flash("msg_none", "Item cadastrado");
    res.redirect("/inventario/");
  } catch (error) {
    console.log(error);
    req.flash("msg_error", "Ocorreu um erro");
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  } finally {
    await inventModel.closeConection();
  }
};

const updateInvent = async (
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
  data_compra,
) => {
  try {
    const id = patrimonio;
    const foundInvent = await inventModel.findById(id);
    if (foundInvent) {
      return res.status(400).json({
        error: "ocorreu um erro ao encontrar o patrimonio",
      });
    }
    const parts = data_compra.split("/");
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    const valorestimNum = Number(
      valorestim.replace(/[^\d.,]/g, "").replace(",", ".")
    );
    const invent = {
      unidade: unidade,
      descricao: descricao,
      modelo: modelo,
      localizacao: localizacao,
      valorestim: valorestimNum,
      usuario: usuario,
      nserie: nserie,
      data_compra: formattedDate,
    };
    await inventModel.update(id, invent);
    req.flash("msg_none", "Item Alterado");
    return res.redirect("/inventario/");
  } catch (error) {
    req.flash("msg_error", "Ocorreu um erro");
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  } finally {
    await inventModel.closeConection();
  }
};

const deleteInvent = async (req, res, patrimonio) => {
  try {
    const foundInvent = await inventModel.findById(patrimonio);
    if (!foundInvent) {
      return res.status(400).json({
        message: "item não encontrado",
      });
    }
    await inventModel.delete(patrimonio);

    req.flash("msg_none", "Item excluido com sucesso");
    return res.redirect("/inventario");
  } catch (error) {
    req.flash("msg_error", "Ocorreu um erro ao excluir o item");
    return res.status(500).json({
      message: "ocorreu um erro ao excluir o item",
    });
  } finally {
    await inventModel.closeConection();
  }
};

module.exports = {
  getfull,
  getInvent,
  createInvent,
  updateInvent,
  deleteInvent,
};
