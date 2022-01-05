const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

//Models
const User = require("../models/User");

exports.register = (req, res) => {
  //Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  
  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "User already exists!" });
    }
    else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      });
      //Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
            User.create(newUser).then(user => {
              res.json(user);
            }).catch(err => console.log(err));
        });
      });
    }
  }).catch(err => console.log(err));
};

exports.login = (req, res) => {
  //Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    //Check if user exists
    if (!user) {
      return res.status(404).json({ usernotfound: "User not found" });
    }
    //Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //Create JWT Payload, this data is stored in the token
        const payload = {
          //Change values here to control what user object has on frontend
          id: user.id,
          email: user.email
        };
        // Sign token
        jwt.sign(payload, process.env.secret, {
            expiresIn: 259200 //3 days in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      }
      else {
        return res.status(400).json({ passwordincorrect: "Password incorrect" });
      }
    });
  }).catch(err => console.log(err));
};
