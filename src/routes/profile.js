const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const {
  validateEditProfileData,
  validatePasswordUpdate,
} = require("../common/validations");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.status(200).send({
      message: "profile found",
      profile: req.user,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message || `Something Went Wrong`,
    });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user; // userAuth middleware is setting the user

    const updatedUserData = await User.findByIdAndUpdate(
      loggedInUser._id,
      { $set: req.body },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedUserData) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Changes Saved!",
      data: updatedUserData,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error!",
    });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    //validate the current password and new password
    await validatePasswordUpdate(req);

    //update the password
    const loggedInUser = req.user;
    const { newPassword } = req.body;
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    const updatedUserData = await User.findByIdAndUpdate(
      loggedInUser._id,
      { $set: { password: newPasswordHash } },
      {
        runValidators: true,
      },
    );

    if (!updatedUserData) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    //send the response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

module.exports = profileRouter;
