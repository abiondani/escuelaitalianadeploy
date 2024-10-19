const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const express = require("express");

// Nuestra app escuchará el puerto 127.0.0.1:3000
const PORT = process.env.PORT || 3000;
const app = express();

// Se estable la conexion con la base de datos y se registra
// el modelo de Mongoose de manera global.
mongoose.connect("mongodb://localhost/escuela");
require("./models/escuela");

console.log("MongoDB.........[OK]");

// Middlewares para procesar el body de requests HTTP.
// urlencoded lo usamos para procesar los datos de los
// formularios.
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("Middlewares.....[OK]");

// Definimos a PUG como nuestro motor de plantillas.
app.set("views", "./views");
app.set("view engine", "pug");

console.log("Vistas..........[OK]");

// Rutas
const appRoutes = require("./routes/appRoutes");
const administrativoRoutes = require("./routes/administrativoRoutes");
const alumnoRoutes = require("./routes/alumnoRoutes");
const profesorRoutes = require("./routes/profesorRoutes");
app.use("/", appRoutes);
app.use("/administrativo", administrativoRoutes);
app.use("/alumno", alumnoRoutes);
app.use("/profesor", profesorRoutes);

console.log("Rutas...........[OK]");

// Iniciamos el servidor:puerto y precargamos datos de
// prueba
iniciarApp();

async function iniciarApp() {
    try {
        // Carga inicial de datos. Si un esquema ya posee datos
        // resultado=true, deja de cargar los esquemas siguientes.
        let resultado = await cargaInicial("usuarios.json", "Usuario");
        if (resultado) resultado = await cargaInicial("alumnos.json", "Alumno");
        if (resultado) resultado = await cargaInicial("cursos.json", "Curso");
        if (resultado) resultado = await cargaInicial("materias.json", "Materia");
        // Inicia el servidor para escuchar requests HTTP.
        app.listen(PORT, () => {
            console.log(
                `El servidor está corriendo en http://localhost:${PORT}`
            );
        });
    } catch (err) {
        console.error("Error durante la inicialización de la app:\n", err);
    }
}

// Creamos una función que precarga datos en la base
// para poder verificar el funcionamiento de la app.
async function cargaInicial(archivo, esquema) {
    try {
        console.log(`Intentando cargar el esquema ${esquema}...`);

        const ruta = path.join(__dirname, "data", archivo);
        const datos = JSON.parse(fs.readFileSync(ruta, "utf8"));
        const Esquema = mongoose.model(esquema);
        const count = await Esquema.countDocuments();

        if (count != 0) {
            console.log(
                `Ya existen datos de ${esquema}, se omite la carga inicial.`
            );
            return false;
        }

        await Esquema.insertMany(datos);
        console.log(`Carga exitosa de ${esquema}.`);
        return true;
    } catch (err) {
        console.error(`Error durante la carga inicial de ${esquema}:\n`, err);
        throw new Error(
            `Error durante la carga inicial de ${esquema}: ${err.message}`
        );
    }
}
