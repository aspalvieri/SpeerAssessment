const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const MessageSchema = new Schema({
  //The email of the person who sent the message
  sender_email: {
    type: String,
    required: true
  },
  //The message itself
  message: {
    type: String,
    maxlength: 120,
    required: true
  }
}, {
  timestamps: true
});

module.exports = Message = mongoose.model("messages", MessageSchema);
