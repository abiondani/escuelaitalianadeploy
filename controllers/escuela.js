var mongoose = require("mongoose");
var Alumno = mongoose.model("Alumno");

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

