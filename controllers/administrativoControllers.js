const Rol = require("../objects/rolEnum");
const bcrypt = require("bcrypt");
var mongoose = require("mongoose");
var Alumno = mongoose.model("Alumno");
var Usuario = mongoose.model("Usuario");
var Curso = mongoose.model("Curso");
var Materia = mongoose.model("Materia");
var Profesor = mongoose.model("Profesor");

exports.administrativo = async (req, res) => {
    res.render("menuAdmin", { usuario: req.params.usuario });
};

exports.getAlumnos = async (req, res) => {
    try {
        const alumnos = await Alumno.find()
            .populate("usuario")
            .sort({ apellido: 1 });
        res.render("admin/listAlumno", {
            alumnos: alumnos,
            usuario: req.params.usuario,
        });
    } catch (err) {
        console.log("Error interno del servidor\n", err);
        res.status(500).render("admin/listAlumno", {
            error: "Error interno del servidor",
            alumnos: alumnos,
            usuario: req.params.usuario,
        });
    }
};

exports.newAlumno = async (req, res) => {
    res.render("admin/newAlumno", { usuario: req.params.usuario });
};

exports.addAlumno = async (req, res) => {
    try {
        const saltRounds = 3;
        const { nombre, apellido, usuarioNombre, usuarioClave } = req.body;
        const passwordHash = await bcrypt.hash(usuarioClave, saltRounds);

        const usuario = await Usuario.findOne({ usuario: usuarioNombre });
        if (usuario) {
            res.status(409).render("admin/newAlumno", {
                error: `El usuario ${usuarioNombre} ya existe, escoja otro.`,
            });
        }

        const ultimoUsuario = await Usuario.findOne().sort({ _id: -1 });
        const nuevoUsuarioId = ultimoUsuario ? ultimoUsuario._id + 1 : 1;

        const nuevoUsuario = new Usuario({
            _id: nuevoUsuarioId,
            usuario: usuarioNombre,
            clave: passwordHash,
            rol: Rol.ALUMNO,
        });
        await nuevoUsuario.save();

        const ultimoAlumno = await Alumno.findOne().sort({ _id: -1 });
        const nuevoAlumnoId = ultimoAlumno ? ultimoAlumno._id + 1 : 1;

        const nuevoAlumno = new Alumno({
            _id: nuevoAlumnoId,
            nombre: nombre,
            apellido: apellido,
            clave: usuarioClave,
            usuario: nuevoUsuarioId,
        });
        await nuevoAlumno.save();

        res.render("admin/newAlumno", {
            success: "Alta de alumno exitosa",
            usuario: req.params.usuario,
        });
    } catch (err) {
        console.log(
            "Error interno del servidor al dar de alta un alumno\n",
            err
        );
        res.status(500).render("admin/newAlumno", {
            error: "Error interno del servidor",
        });
    }
};

exports.editAlumno = async (req, res) => {
    try {
        const alumno = await Alumno.findById(req.params.id).populate("usuario");
        res.render("admin/editAlumno", {
            alumno: alumno,
            usuario: req.params.usuario,
        });
    } catch (err) {
        console.log(
            "Error interno del servidor al dar de baja un alumno\n",
            err
        );
        res.status(500).render("admin/editAlumno", {
            error: "Error interno del servidor",
            alumno: alumno,
            usuario: req.params.usuario,
        });
    }
};

exports.updateAlumno = async (req, res) => {
    try {
        const {
            _id,
            nombre,
            apellido,
            usuarioId,
            usuarioNombre,
            usuarioClave,
        } = req.body;

        await Usuario.updateOne(
            { _id: usuarioId },
            { usuario: usuarioNombre, clave: usuarioClave }
        );

        await Alumno.updateOne({ _id }, { nombre, apellido });

        const alumno = await Alumno.findById(_id).populate("usuario");

        res.render("admin/editAlumno", {
            alumno: alumno,
            success: "Actualización de alumno exitosa",
            usuario: req.params.usuario,
        });
    } catch (err) {
        console.log(
            "Error interno del servidor al actualizar un alumno\n",
            err
        );
        res.status(500).render("admin/editAlumno", {
            error: "Error interno del servidor",
            alumno: alumno,
            usuario: req.params.usuario,
        });
    }
};

exports.delAlumno = async (req, res) => {
    try {
        const alumno = await Alumno.findById(req.params.id);
        await Alumno.deleteOne({ _id: alumno._id });
        await Usuario.deleteOne({ _id: alumno.usuario });
        await Curso.deleteMany({ alumno: alumno._id });
        res.redirect(`/administrativo/${req.params.usuario}/alumnos`);
    } catch (err) {
        console.log(
            "Error interno del servidor al dar de baja un alumno\n",
            err
        );
        res.status(500).render("admin/listAlumno", {
            error: "Error interno del servidor",
            usuario: req.params.usuario,
        });
    }
};

exports.formularioInscripcion = async (req, res) => {
    const materias = await Materia.find().sort({ nombre: 1 });
    const profesores = await Profesor.find().sort({ apellido: 1 });
    const alumno = await Alumno.findOne({ _id: req.params.id });

    res.render("admin/newCurso", {
        usuario: req.params.usuario,
        materias: materias,
        id: req.params.id,
        alumno: alumno,
        profesores: profesores,
    });
};

exports.addCurso = async (req, res) => {
    try {
        const { idAlumno, materia, profesor } = req.body;
        const alumnoEncontrado = await Alumno.findById(idAlumno);
        if (alumnoEncontrado) {
            const ultimoCurso = await Curso.findOne().sort({ _id: -1 });
            const nuevoCursoId = ultimoCurso ? ultimoCurso._id + 1 : 1;

            const nuevoCurso = new Curso({
                _id: nuevoCursoId,
                materia: materia,
                profesor: profesor,
                alumno: idAlumno,
                calificacion: 0,
            });
            await nuevoCurso.save();

            const materias = await Materia.find().sort({ nombre: 1 });
            const profesores = await Profesor.find().sort({ apellido: 1 });

            res.render("admin/newCurso", {
                success: "Inscripción a curso exitosa",
                usuario: req.params.usuario,
                materias: materias,
                id: req.params.id,
                alumno: alumnoEncontrado,
                profesores: profesores,
            });
        } else {
            return res.status(400).render("admin/newCurso", {
                error: "ID de Alumno incorrecto",
                usuario: req.params.usuario,
            });
        }
    } catch (err) {
        console.log(
            "Error interno del servidor al inscribir a un curso\n",
            err
        );
        res.status(500).render("admin/newCurso", {
            error: "Error interno del servidor",
        });
    }
};

exports.getCursos = async (req, res) => {
    try {
        const cursos = await Curso.find()
            .populate("alumno")
            .sort({ materia: 1 });
        cursos.sort((a, b) => {
            if (a.materia == b.materia) {
                if (a.alumno.apellido < b.alumno.apellido) return -1;
                else if (a.alumno.apellido > b.alumno.apellido) return 1;
                else return 0;
            } else {
                return 0;
            }
        });
        const usuario = await Usuario.findOne({ usuario: req.params.usuario });
        if (usuario.rol == Rol.PROFESOR) {
            res.render("menuProfesor", { usuario: usuario, cursos: cursos });
        } else {
            res.render("admin/listCurso", { usuario: usuario, cursos: cursos });
        }
    } catch (err) {
        console.log("Error interno del servidor\n", err);
        res.status(500).render("menuProfesor", {
            error: "Error interno del servidor",
        });
    }
};

exports.delCurso = async (req, res) => {
    try {
        await Curso.deleteOne({ _id: req.params.id });
        res.redirect(`/administrativo/${req.params.usuario}/cursos`);
    } catch (err) {
        console.log(
            "Error interno del servidor al dar de baja un alumno en un curso\n",
            err
        );
        res.status(500).render("admin/listCurso", {
            error: "Error interno del servidor",
        });
    }
};

exports.editCurso = async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.id).populate("alumno");
        const materias = await Materia.find().sort({ nombre: 1 });
        const profesores = await Profesor.find().sort({ apellido: 1 });
        res.render("admin/editCurso", {
            curso: curso,
            usuario: req.params.usuario,
            materias: materias,
            profesores: profesores,
        });
    } catch (err) {
        console.log("Error interno del servidor al encontrar el curso\n", err);
        res.status(500).render("admin/delAlumno", {
            error: "Error interno del servidor",
        });
    }
};

exports.updateCurso = async (req, res) => {
    try {
        const { materia, profesor, calificacion } = req.body;
        await Curso.updateOne(
            { _id: req.params.id },
            { materia, profesor, calificacion }
        );
        const usuario = await Usuario.findOne({ usuario: req.params.usuario });
        const curso = await Curso.findOne({ _id: req.params.id }).populate(
            "alumno"
        );
        const materias = await Materia.find().sort({ nombre: 1 });
        const profesores = await Profesor.find().sort({ apellido: 1 });
        if (usuario.rol == Rol.PROFESOR) {
            res.render("profesor/editCurso", {
                success: "Actualización de nota exitosa",
                curso: curso,
                usuario: req.params.usuario,
                materias: materias,
                profesores: profesores,
            });
        } else {
            res.render("admin/editCurso", {
                success: "Actualización de curso exitosa",
                curso: curso,
                usuario: req.params.usuario,
                materias: materias,
                profesores: profesores,
            });
        }
    } catch (err) {
        console.log("Error interno del servidor al actualizar un curso\n", err);
        res.status(500).render("admin/editCurso", {
            error: "Error interno del servidor",
        });
    }
};
