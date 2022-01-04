//Input validation
const validateMessageInput = require("../validation/message");

//User model
const User = require("../models/User");
const Message = require("../models/Message");

exports.sendMessage = (req, res) => {
  //Form Validation
  const { errors, isValid } = validateMessageInput(req.body, req.user);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Find receiver
  User.findOne({ email: req.body.email }).select("messages").then(user => {
    if (!user) {
      return res.status(400).json({ email: "User not found!" });
    }
    const newMessage = {
      sender_email: req.user.email,
      message: req.body.message
    };
    //Create new message and add it to the receiver's list of messages
    Message.create(newMessage).then(message => {
      user.messages.push(message);
      user.save().then(savedUser => {
        res.status(200).json(savedUser);
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
};

exports.getMessages = (req, res) => {
  User.findOne({ _id: req.user.id }).select("messages").populate("messages").then(user => {
    if (!user) {
      return res.status(400).json({ email: "User not found!" });
    }
    res.status(200).json(user.messages);
  }).catch(err => console.log(err));
}
