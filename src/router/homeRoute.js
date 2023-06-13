const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    res.json({ 'title': 'está na home' });
});

module.exports = router;