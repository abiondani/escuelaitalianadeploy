const Rol = require("../objects/rolEnum");
var mongoose = require("mongoose");
var Alumno = mongoose.model("Alumno");
var Usuario = mongoose.model("Usuario");

// // Método para agregar a un alumno
// exports.addAlumno = async function (req, resp) {
//     try {
//         let nuevoAlumno = new Alumno({
//             nombre: req.body.nombre,
//         });

//         await nuevoAlumno.save();
//         resp.status(201).json(nuevoAlumno);
//     } catch (err) {
//         resp.send(500, err.message);
//     }
// };

// // Método para obtener todos los alumnos
// exports.getAlumnos = async function (req, resp) {
//     try {
//         const alumnos = await Alumno.find();
//         resp.status(200).json(alumnos);
//     } catch (err) {
//         resp.status(500).json({ error: err.message });
//     }
// };

// exports.getAlumnos = async (req, res) => {
//     try {
//         console.log("Ingresando al CRUD de alumnos!");
//         const alumnos = await Alumno.find().populate("usuario");
//         console.log(alumnos);
//         res.render("alumnos/index", { alumnos: alumnos });
//     } catch (err) {
//         console.log("Error interno del servidor\n", err);
//         resp.status(500).render("index", {
//             error: "Error interno del servidor",
//         });
//     }
// };

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
                .status(400)
                .render("index", { error: "Usuario no encontrado" });
        }

        if (usuarioRecuperado.clave != contrasena) {
            console.log("Login fallido: Contraseña incorrecta.");
            return res
                .status(400)
                .render("index", { error: "Contraseña incorrecta" });
        }

        console.log("Login exitoso");
        await enrutar(usuarioRecuperado, res);
    } catch (err) {
        console.log("Error interno del servidor\n", err);
        return res
            .status(500)
            .render("index", { error: "Error interno del servidor" });
    }
};

async function enrutar(usuario, res) {
    switch (usuario.rol) {
        case Rol.ALUMNO:
            console.log("Bienvenido a la sección de alumnos");
            return res.redirect(`/alumno?usuario=${usuario._id}`);
        case Rol.ADMINISTRATIVO:
            console.log("Bienvenido a la sección de administrativos");
            return res.redirect(`/administrativo?usuario=${usuario.usuario}`);
        case Rol.PROFESOR:
            console.log("Bienvenido a la sección de profesores");
            break;
    }
}
