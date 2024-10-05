const express = require('express');
const app = express();

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/escuela");
require("./models/escuela");

var alumno = express.Router();
var AlumnoCtrl = require("./controllers/escuela");


// app.get('/', (req, res) => {
//   res.send('Hola, Mundo!!');
// });

alumno.route("/alumno").post(AlumnoCtrl.addAlumno);
app.use(express.json());
app.use("/", alumno);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});