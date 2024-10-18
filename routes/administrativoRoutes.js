const express = require("express");
const router = express.Router();
const administrativoController = require("../controllers/administrativoControllers");

router.get("/", administrativoController.administrativo);
router.get("/alumnos", administrativoController.getAlumnos);
router.get("/alumnos/new", administrativoController.newAlumno);
router.post("/alumno", administrativoController.addAlumno);
router.get("/alumno/delete/:id", administrativoController.delAlumno);
router.get("/inscripcion/:usuario", administrativoController.getCursos);

router.get("/alumno/edit/:id", administrativoController.editAlumno);
router.post("/alumno/update/:id", administrativoController.updateAlumno);

module.exports = router;
