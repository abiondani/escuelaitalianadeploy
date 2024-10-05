var mongoose = require("mongoose");
var Alumno = mongoose.model("Alumno");

exports.addAlumno = function (req, resp) {
    console.log("alta del alumno:");
    console.log(req.body);
    let nuevoAlumno = new Alumno({
        nombre: req.body.nombre,
    });
    nuevoAlumno.save((err, nuevoAlumno) => {
        if (err) {
            console.log("Error!!!");
            return resp.send(500, err.message);
        } else {
            resp.status(201).jsonp(nuevoAlumno);
        }
    });
};

