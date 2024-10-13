var mongoose = require("mongoose");
var Alumno = mongoose.model("Alumno");
var Usuario = mongoose.model("Usuario");

// Método para agregar a un alumno
exports.addAlumno = async function (req, resp) {
    try {
        let nuevoAlumno = new Alumno({
            nombre: req.body.nombre,
        });

        await nuevoAlumno.save();
        resp.status(201).json(nuevoAlumno);
    } catch (err) {
        resp.send(500, err.message);
    }
};

// Método para obtener todos los alumnos
exports.getAlumnos = async function (req, resp) {
    try {
        const alumnos = await Alumno.find();
        resp.status(200).json(alumnos);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
};

exports.login = async function (req, res) {
    try {
        const { usuario, contrasena } = req.body;
        const usuarioRecuperado = await Usuario.findOne({ usuario: usuario }).populate("Alumno");

        if (!usuarioRecuperado) {
            return res
                .status(400)
                .render("index", { error: "Usuario no encontrado" });
        } else {
            if (usuarioRecuperado.clave === contrasena) {
                return res.redirect("/app");
            } else {
                return res
                    .status(400)
                    .render("index", { error: "Contraseña incorrecta" });
            }
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
};
