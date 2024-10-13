const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const pug = require("pug");

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
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});
