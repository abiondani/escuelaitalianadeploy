const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Esquema para Alumnos
const alumnoSchema = new Schema({
    _id: {
        type: Number,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    usuario: {
        type: Number,
        ref: "Usuario",
    },
});

// Esquema para Usuarios
const usuarioSchema = new Schema({
    _id: {
        type: Number,
        required: true,
    },
    usuario: {
        type: String,
        required: true,
    },
    clave: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        required: true,
    },
});

// Esquema para Cursos
const cursoSchema = new Schema({
    _id: {
        type: Number,
        required: true,
    },
    materia: {
        type: String,
        required: true,
    },
    profesor: {
        type: String,
    },
    alumno: {
        type: Number,
        ref: "Alumno",
    },
    calificacion: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
    },
});

const materiaSchema = new Schema({
    _id: {
        type: Number,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
});

const profesorSchema = new Schema({
    _id: {
        type: Number,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    usuario: {
        type: Number,
        ref: "Usuario",
    },
});

// Modelos
const Alumno = mongoose.model("Alumno", alumnoSchema);
const Usuario = mongoose.model("Usuario", usuarioSchema);
const Curso = mongoose.model("Curso", cursoSchema);
const Materia = mongoose.model("Materia", materiaSchema);
const Profesor = mongoose.model("Profesor", profesorSchema);

module.exports = { Alumno, Usuario, Curso, Materia, Profesor };
