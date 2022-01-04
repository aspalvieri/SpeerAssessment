//Input validation
const validateTweetInput = require("../validation/tweet");

//Models
const User = require("../models/User");
const Tweet = require("../models/Tweet");

exports.postTweet = (req, res) => {
  //Form Validation
  const { errors, isValid } = validateTweetInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Create tweet and add it to user's tweets
  const newTweet = {
    user_id: req.user.id,
    message: req.body.message
  }
  Tweet.create(newTweet).then(tweet => {
    User.findOneAndUpdate({ _id: req.user.id }, { "$push": { tweets: tweet.id } }, { new: true }).then(user => {
      res.status(200).json(user);
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
};

exports.getTweets = (req, res) => {
  //Get the email from either the request, or the logged in user
  const email = req.params.email || req.user.email;

  User.findOne({ email: email }).select("tweets").populate("tweets").then(user => {
    if (!user) {
      return res.status(400).json({ email: "User not found!" });
    }
    res.status(200).json(user.tweets);
  }).catch(err => console.log(err));
};

exports.deleteTweet = (req, res) => {
  User.findOneAndUpdate({ _id: req.user.id }, { "$pullAll": { tweets: [req.params.id] } }, { new: true }).then(user => {
    if (!user) {
      return res.status(400).json({ email: "User not found!" });
    }
    Tweet.findOneAndDelete({ _id: req.params.id, user_id: req.user.id }).then(tweet => {
      res.status(200).json(user);
    });
  }).catch(err => console.log(err));
};

exports.updateTweet = (req, res) => {
  //Form Validation
  const { errors, isValid } = validateTweetInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Tweet.findOneAndUpdate({ _id: req.params.id, user_id: req.user.id }, { message: req.body.message }, { new: true }).then(tweet => {
    if (!Tweet) {
      return res.status(400).json({ tweet: "Tweet not found" });
    }
    res.status(200).json(tweet);
  }).catch(err => console.log(err));
};
