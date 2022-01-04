const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorize");

//Controller
const messagesController = require("../controllers/messagesController.js");

//Routes
router.post("/send", auth, messagesController.sendMessage);
router.get("/", auth, messagesController.getMessages);

module.exports = router;
