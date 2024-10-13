const express = require('express');
const app = express();
const pug = require('pug');

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/escuela");
require("./models/escuela");

var alumno = express.Router();
var AlumnoCtrl = require("./controllers/escuela");


// app.get('/', (req, res) => {
//   res.send('Hola, Mundo!!');
// });

app.use(express.json());

alumno.route("/alumno").post(AlumnoCtrl.addAlumno);
alumno.route("/alumno").get(AlumnoCtrl.getAlumnos);

app.use("/api", alumno);

app.set('views', './views');
app.set('view engine', 'pug');
app.get('/', function (req, res) {
  res.render('index');
  });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});