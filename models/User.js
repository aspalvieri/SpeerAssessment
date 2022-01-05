const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  //Email/username, must be of type 'email'
  email: {
    type: String,
    required: true
  },
  //Password. For validation, use password2 for the confirmation one
  password: {
    type: String,
    required: true
  },
  //Array of message IDs for every received message other users sent
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages"
    }
  ],
  //Array of tweet IDs for tweets the user posted
  tweets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tweets"
    }
  ]
}, {
  timestamps: true
});

module.exports = User = mongoose.model("users", UserSchema);
