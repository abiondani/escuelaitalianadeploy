var mongoose = require("mongoose");
var Alumno = mongoose.model("Alumno");
var Curso = mongoose.model("Curso");


exports.getCursos = async (req, res) => {
    try {
        const cursos = await Curso.find({calificacion: 0}).populate("alumno");
        const usuario = req.query;
        res.render("menuProfesor", { usuario, cursos: cursos });        
    } catch (err) {
        console.log("Error interno del servidor\n", err);
        res.status(500).render("menuProfesor", {
            error: "Error interno del servidor",
        });
    }
};

exports.editCurso = async (req, res) => {

    console.log("prueba");
};