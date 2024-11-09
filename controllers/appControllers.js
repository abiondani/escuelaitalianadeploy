const Rol = require("../objects/rolEnum");
const bcrypt = require("bcrypt");
var mongoose = require("mongoose");
var Usuario = mongoose.model("Usuario");

exports.index = async function (req, res) {
    return res.render("index");
};

exports.login = async function (req, res) {
    try {
        const { usuario, contrasena } = req.body;
        const usuarioRecuperado = await Usuario.findOne({ usuario: usuario });

        if (!usuarioRecuperado) {
            console.log("Login fallido: Usuario no encontrado.");
            return res
                .status(401)
                .render("index", { error: "Usuario no encontrado" });
        }

        autorizado = await bcrypt.compare(contrasena, usuarioRecuperado.clave);
        if (!autorizado) {
            console.log("Login fallido: Contraseña incorrecta.");
            return res
                .status(401)
                .render("index", { error: "Contraseña incorrecta" });
        }

        console.log("Login exitoso");
        await evaluarRol(usuarioRecuperado, res);
    } catch (err) {
        console.log("Error interno del servidor\n", err);
        return res
            .status(500)
            .render("index", { error: "Error interno del servidor" });
    }
};

async function evaluarRol(usuario, res) {
    switch (usuario.rol) {
        case Rol.ALUMNO:
            console.log("Bienvenido a la sección de alumnos");
            return res.redirect(`/alumno?usuario=${usuario._id}`);
        case Rol.ADMINISTRATIVO:
            console.log("Bienvenido a la sección de administrativos");
            return res.redirect(`/administrativo/${usuario.usuario}`);
        case Rol.PROFESOR:
            console.log("Bienvenido a la sección de profesores");
            return res.redirect(`/profesor/${usuario.usuario}`);
    }
}
