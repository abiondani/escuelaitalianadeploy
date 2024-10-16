const express = require("express");
const router = express.Router();
const alumnoController = require("../controllers/alumnoControllers");

router.get("/", alumnoController.getCursos);

module.exports = router;
