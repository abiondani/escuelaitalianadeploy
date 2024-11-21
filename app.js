const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");

const { authenticateSession } = require("./middlewares/middleware");

// Nuestra app escuchará el puerto 127.0.0.1:3000
const PORT = process.env.PORT || 3000;
const app = express();

// Se estable la conexion con la base de datos y se registra
// el modelo de Mongoose de manera global.
//const dbUri = "mongodb://localhost:27017/escuela";
const db_password = "EscuelaItaliana";
const dbUri = `mongodb+srv://fullstack:${db_password}@clusterescuelaitaliana.4b61u.mongodb.net/escuela?retryWrites=true&w=majority&appName=ClusterEscuelaItaliana`;
mongoose.connect(dbUri);
require("./models/escuela");

console.log("MongoDB.........[OK]");

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

console.log("Sesiones........[OK]");

// Middlewares para procesar el body de requests HTTP.
// urlencoded lo usamos para procesar los datos de los
// formularios.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
app.use("/administrativo", authenticateSession, administrativoRoutes);
app.use("/alumno", authenticateSession, alumnoRoutes);
app.use("/profesor", authenticateSession, profesorRoutes);

console.log("Rutas...........[OK]");

// Iniciamos el servidor:puerto y precargamos datos de
// prueba

// Inicia el servidor para escuchar requests HTTP.
if (process.env.NODE_ENV != "test") {
    iniciarApp();

    app.listen(PORT, () => {
        console.log(`El servidor está corriendo en http://localhost:${PORT}`);
    });
} else {
    iniciarApp();
}

module.exports = app;

async function iniciarApp() {
    try {
        // Carga inicial de datos. Si un esquema ya posee datos
        // resultado=true, deja de cargar los esquemas siguientes.
        let resultado = await cargaInicial("usuarios.json", "Usuario");
        if (resultado) resultado = await cargaInicial("alumnos.json", "Alumno");
        if (resultado) resultado = await cargaInicial("cursos.json", "Curso");
        if (resultado)
            resultado = await cargaInicial("materias.json", "Materia");
        if (resultado)
            resultado = await cargaInicial("profesores.json", "Profesor");
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
        let datos = JSON.parse(fs.readFileSync(ruta, "utf8"));
        const Esquema = mongoose.model(esquema);
        const count = await Esquema.countDocuments();
        if (count != 0) {
            console.log(
                `Ya existen datos de ${esquema}, se omite la carga inicial.`
            );
            return false;
        }

        if (esquema === "Usuario") {
            let datosActualizados = await hashPasswords(datos);
            await Esquema.insertMany(datosActualizados);
        } else {
            await Esquema.insertMany(datos);
        }

        console.log(`Carga exitosa de ${esquema}.`);
        return true;
    } catch (err) {
        console.error(`Error durante la carga inicial de ${esquema}:\n`, err);
        throw new Error(
            `Error durante la carga inicial de ${esquema}: ${err.message}`
        );
    }
}

async function hashPasswords(datos) {
    for (let i = 0; i < datos.length; i++) {
        try {
            let passwordHash = await bcrypt.hash(datos[i].clave, 3);
            datos[i].clave = passwordHash;
        } catch (error) {
            console.error(
                "Error al hashear la contraseña del usuario",
                datos[i].usuario,
                error
            );
        }
    }
    return datos;
}
