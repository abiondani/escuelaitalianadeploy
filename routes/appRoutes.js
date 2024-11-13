const express = require("express");
const router = express.Router();
const appControllers = require("../controllers/appControllers");

router.get("/", appControllers.index);
router.post("/login", appControllers.login);
router.get("/logout", appControllers.logout);

module.exports = router;
