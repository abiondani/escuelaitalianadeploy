const express = require("express");
const router = express.Router();
const administrativoController = require("../controllers/administrativoControllers");

router.get("/", administrativoController.administrativo);
router.get("/alumnos", administrativoController.getAlumnos);
router.get("/alumnos/new", administrativoController.newAlumno);
router.post("/alumno", administrativoController.addAlumno);

module.exports = router;
