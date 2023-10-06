const Validator = require("validator");
const isEmpty = require("is-empty");

const validateLoginInput = data => {
  const errors = {};

  console.log("In validateLoginInput, data looks like this:");
  for (const [key, value] of Object.entries(data)) {
    console.log(`${key}: ${value}`);
  }

  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Username checks
  const usernameRegex =
    /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  } else if (!Validator.matches(data.username, usernameRegex)) {
    errors.username = "Username is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateLoginInput;