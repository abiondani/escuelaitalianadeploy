var mongoose = require("mongoose");
var Alumno = mongoose.model("Alumno");

// Método para agregar a un alumno
exports.addAlumno = async function (req, resp) {
    try {
        console.log("alta del alumno:");
        console.log(req.body);
        let nuevoAlumno = new Alumno({
            nombre: req.body.nombre
        });
        console.log(req.body.nombre);

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