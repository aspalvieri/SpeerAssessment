const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorize");

//Controller
const tweetsController = require("../controllers/tweetsController.js");

//Routes
router.post("/post", auth, tweetsController.postTweet);
//Getting tweets for either the logged in user or the specified user
router.get("/", auth, tweetsController.getTweets);
router.get("/:email", tweetsController.getTweets);

router.post("/delete/:id", auth, tweetsController.deleteTweet);
router.post("/update/:id", auth, tweetsController.updateTweet);

//Handles liking/unliking a post
router.post("/like/:id", auth, tweetsController.likeTweet);

router.post("/retweet/:id", auth, tweetsController.retweet);

module.exports = router;
