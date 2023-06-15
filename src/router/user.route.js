const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const {
  listRouteHandler,
  forgotPasswordRouteHandler,
  loginRouteHandler,
  registerRouteHandler,
  resetPasswordRouteHandler,
} = require("../controllers/user.controller");

router.use(cookieParser());

router.get("/show", async (req, res, next) => {
  try {
    const user = await listRouteHandler(req, res);
    res.json({ listagem: user });
  } catch (error) {
    next(error); // Encaminhar o erro para o próximo middleware de tratamento de erros
  }
});

router.post("/auth", async (req, res) => {
  const { username, password } = req.body;
  const authenticationResult = await loginRouteHandler(
    req,
    res,
    username,
    password
  );
  if (authenticationResult.success) {
    req.session.save(username);
    return res.sendStatus(200);
  } else {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  return res.sendStatus(204);
});

router.post("/registrar", async (req, res) => {
  const { username, name, email, password } = req.body;
  await registerRouteHandler(req, res, username, name, email, password);
});

router.post("/esqueci-senha", async (req, res) => {
  const { email } = req.body;
  await forgotPasswordRouteHandler(req, res, email);
});

router.get("/reset", (req, res) => {
  res.render("reset-password"); // Renderizar uma página para redefinir a senha
});

router.post("/reset", async (req, res) => {
  const { token, email } = req.query;
  const { password, cPass } = req.body;
  if (cPass === password) {
    await resetPasswordRouteHandler(req, res, email, password, cPass, token);
  } else {
    res.status(400).json({
      message: "Confirmação de senha incorreta",
    });
  }
});

module.exports = router;
