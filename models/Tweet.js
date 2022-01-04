const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const TweetSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  message: {
    type: String,
    maxlength: 120,
    required: true
  }
}, {
  timestamps: true
});

module.exports = Tweet = mongoose.model("tweets", TweetSchema);
