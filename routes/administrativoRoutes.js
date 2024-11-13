const express = require("express");
const router = express.Router();
const administrativoController = require("../controllers/administrativoControllers");

// Rutas para el manejo de usuarios
router.get("/", administrativoController.administrativo);
router.get("/alumnos", administrativoController.getAlumnos);
router.get("/alumnos/new", administrativoController.newAlumno);
router.post("/alumno", administrativoController.addAlumno);
router.get("/alumno/delete/:id", administrativoController.delAlumno);
router.get("/alumno/edit/:id", administrativoController.editAlumno);
router.post("/alumno/update/:id", administrativoController.updateAlumno);

// Rutas para el manejo de cursos
router.get("/cursos", administrativoController.getCursos);
router.post("/curso/new/:id", administrativoController.addCurso);
router.get("/curso/new/:id", administrativoController.formularioInscripcion);
router.get("/curso/delete/:id", administrativoController.delCurso);
router.get("/curso/edit/:id", administrativoController.editCurso);
router.post("/curso/update/:id", administrativoController.updateCurso);

module.exports = router;
