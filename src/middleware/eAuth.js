module.exports = {
  eAdmin: function (req, res, next) {
    if (req.isAuthenticated && req.user.eAdmin == 1) {
      return next();
    }
    req.flash(
      "msg_error",
      "Acesso restrito. Você precisa ser um administrador."
    );
    return res.redirect("/user/login");
  },

  eUser: function (req, res, next) {
    if (req.isAuthenticated) {
      return next();
    }
    req.flash("msg_error", "Faça o login para continuar.");
    return res.redirect("/user/login");
  },

  eLogout: function (req, res, next) {
    if (req.isAuthenticated) {
      req.logout();
      return next();
    }
    req.flash("msg_none", "Faça o login novamente para continuar.");
    res.redirect("/user/login");
  },
};
