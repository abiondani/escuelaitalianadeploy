const express = require("express");
const router = express.Router();
const profesorControllers = require("../controllers/profesorControllers");
const administrativoController = require("../controllers/administrativoControllers");

router.get("/:usuario", administrativoController.getCursos);
//router.get("/agregarNota/:id", profesorControllers.editCurso);


module.exports = router;