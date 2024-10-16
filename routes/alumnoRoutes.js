const express = require("express");
const router = express.Router();
const alumnoController = require("../controllers/alumnoControllers");

router.get("/", alumnoController.alumno);

module.exports = router;
