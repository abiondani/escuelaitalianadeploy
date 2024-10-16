const Rol = require("../objects/rolEnum");
var mongoose = require("mongoose");

exports.alumno = async (req, res) => {
    const usuario = req.query;
    res.render("menuAlumno", { usuario });
};
