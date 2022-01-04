const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorize");

//Controller
const messagesController = require("../controllers/messagesController.js");

//Routes
router.post("/sendMessage", auth, messagesController.sendMessage);

module.exports = router;
