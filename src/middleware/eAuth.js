module.exports = {
  eAdmin: function (req, res, next) {
    if (req.isAuthenticated && req.user.eAdmin == 1) {
      return next();
    }
    return res.redirect("/user/login");
  },

  eUser: function (req, res, next) {
    if (req.isAuthenticated) {
      return next();
    }
    return res.redirect("/user/login");
  },

  eLogout: function (req, res, next) {
    if (req.isAuthenticated) {
      req.logout();
      return next();
    }
    res.redirect("/user/login");
  },
};
