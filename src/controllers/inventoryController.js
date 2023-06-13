const inventModel = require('../models/invent');

const selectInvent = async (req, res, patrimonio) => {
   try {
      const foundInvent = await inventModel.findById(patrimonio);
      if (!foundInvent) {
         return res.status(400).json({
            message: "item não encontrado"
         });
      }
      res.json({ listagem: foundInvent });
   } catch (error) {
      return res.status(500).json({
         message: "item não encontrado",
         error: error
      });
   }
}

const registerInvent = async (req, res, patrimonio, unidade, descricao, modelo, localizacao, valorestim, usuario, nserie, data_compra) => {
   const foundInvent = await inventModel.findById(patrimonio);

   if (foundInvent) {
      return res.status(400).json({ message: "item já cadastrado" });
   }

   const currencyRegex = /[\D]/g;
   const valorestimNumerico = Number(valorestim?.replace(currencyRegex, '').replace(',', '.'));

   const parts = data_compra.split('/');
   const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

   const invent = {
      patrimonio: patrimonio,
      unidade: unidade,
      descricao: descricao,
      modelo: modelo,
      localizacao: localizacao,
      valorestim: valorestimNumerico,
      usuario: usuario,
      nserie: nserie,
      data_compra: formattedDate
   }
   try {
      await inventModel.create(invent);
      res.redirect('/inventario/');
   } catch (error) {
      return res.status(500).json({
         message: "Erro interno do servidor",
         error: error
      });
   }
}

const updateInvent = async (req, res, patrimonio, unidade, descricao, modelo, localizacao, valorestim, usuario, nserie, data_compra) => {
   try {
      const id = patrimonio;
      const foundInvent = await inventModel.findById(id);
      if (foundInvent) {
         return res.status(400).json({
            error: "ocorreu um erro ao encontrar o patrimonio"
         });
      }
      const parts = data_compra.split('/');
      const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

      const currencyRegex = /[\D]/g;
      const valorestimNum = Number(valorestim.replace(currencyRegex, '').replace(',', '.'));
      const invent = {
         unidade: unidade,
         descricao: descricao,
         modelo: modelo,
         localizacao: localizacao,
         valorestim: valorestimNum,
         usuario: usuario,
         nserie: nserie,
         data_compra: formattedDate
      }
      await inventModel.update(id, invent);
      return res.redirect('/');

   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno do servidor" });
   }
}


const deleteInvent = async (req, res) => {

}


module.exports = {
   selectInvent,
   registerInvent,
   updateInvent,
   deleteInvent
}