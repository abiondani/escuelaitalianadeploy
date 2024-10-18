var mongoose = require("mongoose");
var Alumno = mongoose.model("Alumno");
var Curso = mongoose.model("Curso");

exports.getCursos = async (req, res) => {
    try {
        const alumno = await Alumno.findOne({ usuario: req.query.usuario });
        let cursos;
        if (alumno) {
            cursos = await Curso.find({ alumno: alumno._id }).sort({
                materia: 1,
                calificacion: 1,
            });
        }
        res.render("menuAlumno", { alumno: alumno, cursos: cursos });
    } catch (err) {
        console.log(
            "Error interno del servidor al recupear las notas del alumno\n",
            err
        );
        res.status(500).render("menuAlumno", {
            error: "Error interno del servidor",
        });
    }
};
