const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is invalid");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email id");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Your password is very weak! Please enter a strong password",
    );
  }
};

module.exports = {
  validateSignUpData,
};
