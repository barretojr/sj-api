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
    req.session.save(username);
    return res.sendStatus(200);
  } else {
    return res.status(401)
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  return res.sendStatus(204);
});


module.exports = router;
