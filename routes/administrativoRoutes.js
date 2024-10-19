const express = require("express");
const router = express.Router();
const administrativoController = require("../controllers/administrativoControllers");

// Rutas para el manejo de usuarios
router.get("/:usuario", administrativoController.administrativo);
router.get("/:usuario/alumnos", administrativoController.getAlumnos);
router.get("/:usuario/alumnos/new", administrativoController.newAlumno);
router.post("/:usuario/alumno", administrativoController.addAlumno);
router.get("/:usuario/alumno/delete/:id", administrativoController.delAlumno);
router.get("/:usuario/alumno/edit/:id", administrativoController.editAlumno);
router.post(
  "/:usuario/alumno/update/:id",
  administrativoController.updateAlumno
);

// Rutas para el manejo de cursos
router.get("/:usuario/cursos", administrativoController.getCursos);
router.post("/:usuario/curso/new/:id", administrativoController.addCurso);
router.get(
  "/:usuario/curso/new/:id",
  administrativoController.formularioInscripcion
);
router.get("/:usuario/curso/delete/:id", administrativoController.delCurso);
router.get("/:usuario/curso/edit/:id", administrativoController.editCurso);
router.post("/:usuario/curso/update/:id", administrativoController.updateCurso);

module.exports = router;
