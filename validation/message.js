const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateLoginInput(data, user) {
  let errors = {};
  //Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.message = !isEmpty(data.message) ? data.message : "";
  //Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  else if (data.email === user.email) {
    errors.email = "Cannot message yourself";
  }
  //Message checks
  if (Validator.isEmpty(data.message)) {
    errors.message = "Message field is required";
  }
  else if (!Validator.isLength(data.message, { min: 1, max: 120 })) {
    errors.message = "Message length greater than 120";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
