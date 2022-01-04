const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages"
    }
  ],
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
