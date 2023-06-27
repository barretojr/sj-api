const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const {
  listRouteHandler,
  loginRouteHandler,
} = require("../controllers/user.controller");

router.use(cookieParser());

router.get("/show", async (req, res, next) => {
  try {
    const user = await listRouteHandler(req, res);
    res.json({ listagem: user });
  } catch (error) {
    next(error);
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
    const token = authenticationResult.token;
    req.session.username = username;
    res.cookie("token", token);
    return res.redirect("/");
  } else {
    return;
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  return res.sendStatus(204);
});

module.exports = router;
