const checkAuthentication = (req, res, next) => {
    if (!req.session.userAuthenticated) {
        return res.status(401).render({
            message: 'Acesso não autorizado'
        });
    }

    next();
}

module.exports = checkAuthentication;