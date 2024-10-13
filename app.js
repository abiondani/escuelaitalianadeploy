const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const pug = require("pug");
const fs = require("fs");
const path = require("path");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/escuela");
require("./models/escuela");

var alumno = express.Router();
var AlumnoCtrl = require("./controllers/escuela");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

alumno.route("/alumno").post(AlumnoCtrl.addAlumno);
alumno.route("/alumno").get(AlumnoCtrl.getAlumnos);
alumno.route("/login").post(AlumnoCtrl.login);

app.use("/api", alumno);

app.set("views", "./views");
app.set("view engine", "pug");
app.get("/", function (req, res) {
    res.render("index");
});
app.get("/app", function (req, res) {
    res.render("app");
});

const PORT = process.env.PORT || 3000;
cargaInicialUsuarios()
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `El servidor está corriendo en http://localhost:${PORT}`
            );
        });
    })
    .catch((err) => {
        console.error("Error al cargar los datos:", err);
    });

async function cargaInicialUsuarios() {
    const rutaDatosUsuarios = path.join(__dirname, "data", "usuarios.json");
    const datosUsuarios = JSON.parse(
        fs.readFileSync(rutaDatosUsuarios, "utf8")
    );
    var Usuario = mongoose.model("Usuario");
    const count = await Usuario.countDocuments();
    console.log(count);

    if (count === 0) {
        await Usuario.insertMany(datosUsuarios);
        await cargaAlumnos();
        console.log(
            "Datos iniciales de usuarios cargados en la base de datos."
        );
    } else {
        console.log(
            "La base de datos ya contiene datos, se omite la carga inicial."
        );
    }
}

async function cargaAlumnos() {
    const rutaDatosAlumno = path.join(__dirname, "data", "alumno.json");
    const datosAlumno = JSON.parse(
        fs.readFileSync(rutaDatosAlumno, "utf8")
    );
    var Alumno = mongoose.model("Alumno");
    const count = await Alumno.countDocuments();
    console.log(count);
    if (count === 0) {
        await Alumno.insertMany(datosAlumno);
        console.log(
            "Datos de los alumnos cargados en la base de datos."
        );
    } else {
        console.log(
            "La base de datos ya contiene datos..."
        );
    }
}
