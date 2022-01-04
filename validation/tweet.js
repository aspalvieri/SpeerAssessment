const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateTweetInput(data) {
  let errors = {};
  //Convert empty fields to an empty string so we can use validator functions
  data.message = !isEmpty(data.message) ? data.message : "";
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
