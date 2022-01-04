const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const TweetSchema = new Schema({
  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = Tweet = mongoose.model("tweets", TweetSchema);
