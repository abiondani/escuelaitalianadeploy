var mongoose = require("mongoose");
var Alumno = mongoose.model("Alumno");

exports.administrativo = async (req, res) => {
    const usuario = req.query;
    res.render("menuAdmin", { usuario });
};

exports.getAlumnos = async (req, res) => {
    try {
        console.log("Ingresando al CRUD de alumnos!");
        const alumnos = await Alumno.find().populate("usuario");
        console.log(alumnos);
        res.render("admin/listAlumno", { alumnos: alumnos });
    } catch (err) {
        console.log("Error interno del servidor\n", err);
        res.status(500).render("admin/listAlumno", {
            error: "Error interno del servidor",
        });
    }
};

exports.newAlumno = async (req, res) => {
    console.log("hola!");
    res.render("admin/newAlumno");
};
