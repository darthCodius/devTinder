const express = require("express");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

const { validateSignUpData, validateLogin } = require("../common/validations");

const User = require("../models/user");

// Create a user
authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    // Encrypt the Password

    const { firstName, lastName, emailId, password, age, gender, skills } =
      req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      gender,
      skills,
      password: passwordHash,
    });
    await user.save();
    res.send({
      status: 200,
      message: "User Signed Up",
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Internal Server Error, ${error.message}`,
    });
  }
});

// Logic a user
authRouter.post("/login", async (req, res) => {
  try {
    // Validate emailId and password
    validateLogin(req);
    const { emailId, password } = req.body;

    // Check if Email is present
    const existingUser = await User.findOne({ emailId }).exec();

    if (!existingUser) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await existingUser.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT Token
      const token = existingUser.getJWT(); // Schema method called on this instance of User Model
      //  Add the token to Cookie and send the response to Client
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.status(200).send({
        message: "Login Successful",
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Something Went Wrong: ${error?.message}`,
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  // Set the 'token' null and expire it instantly and send it, we have chained methods here cookie with send
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send({
      message: "Logged Out!",
    });
});

module.exports = authRouter;
