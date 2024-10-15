const express = require("express");
const router = express.Router();
const appControllers = require("../controllers/appControllers");

router.get("/", appControllers.index);
router.post("/login", appControllers.login);

module.exports = router;
