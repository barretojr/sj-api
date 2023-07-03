const express = require( "express");
const router = express.Router();
const {
  forgotPasswordRouteHandler,
  registerRouteHandler,
  resetPasswordRouteHandler,
} = require( "../controllers/user.controller");

router.post("/registrar", async (req, res) => {
  const { username, name, email } = req.body;
  const password = req.body.password
  await registerRouteHandler(req, res, username, name, email, password);
  
});

router.post("/esqueci-senha", async (req, res) => {  
  const { email } = req.body;
  await forgotPasswordRouteHandler(req, res, email);
});

router.post("/reset", async (req, res) => {
  const { token, email } = req.query;
  const { password, cPass } = req.body;
  await resetPasswordRouteHandler(req, res, email, password, cPass, token);
});

module.exports = router;
