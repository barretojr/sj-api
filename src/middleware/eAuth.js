module.exports = {
  eAdmin: function (req, res, next) {
    if (req.isAuthenticated() && req.user.eAdmin == 1) {
      return next();
    }
    req.flash(
      "msg_error",
      "Acesso restrito. Você precisa ser um administrador."
    );
    res.redirect("/");
  },

  eUser: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("msg_error", "Faça o login para continuar.");
    res.redirect("/user/login");
  },

  eLogout: function (req, res, next) {
    if (req.isAuthenticated()) {
      req.logout();
      return next();
    }
    req.flash("msg_none", "Você foi deslogado.");
    res.redirect("/user/login");
  },
};
