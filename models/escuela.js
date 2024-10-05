const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alumnoSchema = new Schema ({
    nombre: {
        type: String,
        required: true
    }
});

const Alumno = mongoose.model("Alumno", alumnoSchema);
module.exports = Alumno;
