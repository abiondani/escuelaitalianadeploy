const Rol = require("../objects/rolEnum");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var mongoose = require("mongoose");
var Usuario = mongoose.model("Usuario");

passport.use(
    new LocalStrategy(
        {
            usernameField: "usuario",
            passwordField: "contrasena",
        },
        async (usuario, contrasena, done) => {
            const usuarioRecuperado = await Usuario.findOne({
                usuario: usuario,
            });
            if (!usuarioRecuperado) {
                return done(null, false, { message: "Usuario no encontrado" });
            }

            const contrasenaValida = await bcrypt.compare(
                contrasena,
                usuarioRecuperado.clave
            );
            if (!contrasenaValida) {
                return done(null, false, { message: "Contraseña incorrecta" });
            }

            return done(null, usuarioRecuperado);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const userId = Number(id);
    const user = await Usuario.findById(userId);
    done(null, user);
});

exports.index = async function (req, res) {
    return res.render("index");
};

exports.login = async function (req, res) {
    try {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                console.log("Error interno del servidor\n", err);
                return res.status(500).render("index", { error: err });
            }
            if (!user) {
                console.log(`Login fallido: ${info.message}`);
                return res.status(401).render("index", { error: info.message });
            }

            req.login(user, async () => {
                try {
                    await evaluarRol(user, res);
                } catch (err) {
                    throw Error(err);
                }
            });
        })(req, res);
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
            return res.redirect(`/alumno`);
        case Rol.ADMINISTRATIVO:
            console.log("Bienvenido a la sección de administrativos");
            return res.redirect(`/administrativo`);
        case Rol.PROFESOR:
            console.log("Bienvenido a la sección de profesores");
            return res.redirect(`/profesor`);
    }
}

exports.logout = async function (req, res) {
    try {
        req.logout((err) => {
            if (err) {
                console.log("Error interno del servidor\n", err);
                return res.status(500).render("index", { error: err });
            }
            res.redirect("/");
        });
    } catch (err) {
        console.log("Error interno del servidor\n", err);
        return res
            .status(500)
            .render("index", { error: "Error interno del servidor" });
    }
};
