const authenticateSession = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res
        .status(401)
        .render("accesoDenegado", { error: "Usuario No Autenticado" });
};

module.exports = { authenticateSession };
