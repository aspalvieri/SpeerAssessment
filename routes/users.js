const express = require("express");
const router = express.Router();

//Controller
const usersController = require("../controllers/usersController.js");

//Routes
router.post("/register", usersController.register);
router.post("/login", usersController.login);

module.exports = router;
