var mongoose = require("mongoose");
var Alumno = mongoose.model("Alumno");
var Curso = mongoose.model("Curso");


exports.editCurso = async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.id).populate("alumno");
        res.render("profesor/editCurso", { curso: curso, usuario: req.params.usuario });
    } catch (err) {
        console.log(
            "Error interno del servidor al encontrar el curso\n",
            err
        );
        res.status(500).render("admin/delAlumno", {
            error: "Error interno del servidor",
        });
    }
};