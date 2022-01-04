const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MessageSchema = new Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = Message = mongoose.model("messages", MessageSchema);
