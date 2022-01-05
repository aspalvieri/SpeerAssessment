//Input validation
const validateTweetInput = require("../validation/tweet");

//Models
const User = require("../models/User");
const Tweet = require("../models/Tweet");

//Returns the posted tweet object
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
    origin_id: req.user.id,
    message: req.body.message
  }
  Tweet.create(newTweet).then(tweet => {
    User.findOneAndUpdate({ _id: req.user.id }, { "$push": { tweets: tweet.id } }, { new: true }).then(user => {
      res.status(200).json(tweet);
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
};

//Returns array of user's tweet objects
exports.getTweets = (req, res) => {
  //Get the email from either the request, or the logged in user
  const email = req.params.email || req.user.email;

  //Have to use User.find instead of Tweet.find because we're given the email, not ID
  User.findOne({ email: email }).select("tweets").populate("tweets").then(user => {
    if (!user) {
      return res.status(400).json({ email: "User not found!" });
    }
    res.status(200).json(user.tweets);
  }).catch(err => console.log(err));
};

//Returns array of user's tweet objects
exports.deleteTweet = (req, res) => {
  User.findOneAndUpdate({ _id: req.user.id }, { "$pullAll": { tweets: [req.params.id] } }, { new: true }).then(user => {
    if (!user) {
      return res.status(400).json({ email: "User not found!" });
    }
    Tweet.findOneAndDelete({ _id: req.params.id, user_id: req.user.id }).then(tweet => {
      res.status(200).json(user.tweets);
    });
  }).catch(err => console.log(err));
};

//Returns the updated tweet object
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

//Returns the liked tweet
exports.likeTweet = (req, res) => {
  Tweet.findOne({ _id: req.params.id }).then(tweet => {
    if (!tweet) {
      return res.status(400).json({ error: "Tweet not found!" });
    }

    //Debounce
    let found = false;

    //If we have liked it already, unlike it:
    tweet.likes = tweet.likes.filter(like => {
      if (like.toString() === req.user.id) {
        found = true;
        return false;
      }
      return true;
    });

    //If we haven't liked the tweet, like it
    if (!found) {
      tweet.likes.push(req.user.id);
    }

    tweet.save().then(savedTweet => {
      res.status(200).json(savedTweet);
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
};

//Returns the reposted tweet object
exports.retweet = (req, res) => {
  Tweet.findOne({ _id: req.params.id }).then(tweet => {
    if (!tweet) {
      return res.status(400).json({ error: "Tweet not found!" });
    }
    let retweet = {
      user_id: req.user.id,
      origin_id: tweet.origin_id,
      message: tweet.message
    }
    Tweet.create(retweet).then(newTweet => {
      User.findOneAndUpdate({ _id: req.user.id }, { "$push": { tweets: newTweet.id } }, { new: true }).then(user => {
        res.status(200).json(newTweet);
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
};

//Returns the tweet object that was replied to
exports.reply = (req, res) => {
  //Form Validation
  const { errors, isValid } = validateTweetInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const reply = {
    email: req.user.email,
    message: req.body.message
  }
  Tweet.findOneAndUpdate({ _id: req.params.id }, { "$push": { replies: reply } }, { new: true }).then(tweet => {
    if (!tweet) {
      return res.status(400).json({ error: "Tweet not found!" });
    }
    res.status(200).json(tweet);
  }).catch(err => console.log(err));
};
