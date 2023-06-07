const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const {
    forgotPasswordRouteHandler,
    loginRouteHandler,
    registerRouteHandler,
    resetPasswordRouteHandler
} = require("../controllers/auth");


router.use(cookieParser());


router.post('/auth', async (req, res) => {
    const { username, password } = req.body;    
    await loginRouteHandler(req, res, username, password);
    return res.status(401).json({ message: 'Credenciais inválidas' });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    return res.sendStatus(204);
});


router.post('/registrar', async (req, res) => {
    const { username, name, email, password } = req.body;
    await registerRouteHandler(req, res, username, name, email, password);
});

router.post('/esqueci-senha', async (req, res) => {
    const { email } = req.body;
    await forgotPasswordRouteHandler(req, res, email);
});

router.post('/reset', async (req, res) => {
    await resetPasswordRouteHandler(req, res);
});




module.exports = router;