const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const MessageSchema = new Schema({
  sender_email: {
    type: String,
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

module.exports = Message = mongoose.model("messages", MessageSchema);
