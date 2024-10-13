const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alumnoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
});

const usuarioSchema = new mongoose.Schema({
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

const Alumno = mongoose.model("Alumno", alumnoSchema);
const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Alumno;
module.exports = Usuario;
