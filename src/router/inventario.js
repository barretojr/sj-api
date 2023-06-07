const express = require('express');
const router = express.Router();
const database = require('../database/db')

router.get('/', async (req, res) => {    
    try {
        const listagem = await database.showInventory();
        res.json({ listagem }); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro ao exibir os dados do servidor');
    }
});




module.exports = router;