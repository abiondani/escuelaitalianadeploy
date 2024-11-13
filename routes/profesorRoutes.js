const express = require("express");
const router = express.Router();
const profesorControllers = require("../controllers/profesorControllers");
const administrativoController = require("../controllers/administrativoControllers");

router.get("/", administrativoController.getCursos);
router.get("/agregarNota/:id", profesorControllers.editCurso);
router.post("/curso/update/:id", administrativoController.updateCurso);

module.exports = router;
