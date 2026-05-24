const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

const validateLogin = (req) => {
  const { emailId, password } = req.body;

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Credentials");
  }

  if (password.length === 0) {
    throw new Error("Invalid Credentials");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditableFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const { _id } = req.user;
  if (!_id || !mongoose.isValidObjectId(_id)) {
    throw new Error("Invalid User Id!");
  }
  const payload = req.body;

  const isEditAllowed = Object.keys(payload).every((field) =>
    allowedEditableFields.includes(field),
  );

  return isEditAllowed;
};

const validatePasswordUpdate = async (req) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  const isMatch = await bcrypt.compare(currentPassword, req.user.password);

  if (!isMatch) {
    throw new Error("Current password is invalid!");
  }

  if (newPassword !== confirmNewPassword) {
    throw new Error("New Password and Confirm Password do not match");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("New Password is weak!");
  }
};

module.exports = {
  validateSignUpData,
  validateLogin,
  validateEditProfileData,
  validatePasswordUpdate,
};
