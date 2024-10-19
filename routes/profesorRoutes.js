const express = require("express");
const router = express.Router();
const profesorControllers = require("../controllers/profesorControllers");
const administrativoController = require("../controllers/administrativoControllers");

router.get("/:usuario", administrativoController.getCursos);
router.get("/:usuario/agregarNota/:id", profesorControllers.editCurso);
router.post("/:usuario/curso/update/:id", administrativoController.updateCurso);


module.exports = router;