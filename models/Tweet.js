const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const TweetSchema = new Schema({
  //The ID of the user that posted the tweet
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  //The ID of the user that made the initial tweet.
  //This is used for stuff like re-tweeting, to determine
  //if it's an original post, or a copied one
  //EX: user_id !== origin_id : then it's a retweet
  origin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  //The message of the tweet
  message: {
    type: String,
    maxlength: 120,
    required: true
  },
  //Array of user IDs for people who liked the tweet.
  //To show the amount of likes, just do tweet.likes.length
  //on the frontend, after getting the tweets from a user
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  //Array of objects for replies to the tweet.
  //Reply has email of the replier, and the message typed
  replies: [
    {
      email: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = Tweet = mongoose.model("tweets", TweetSchema);
