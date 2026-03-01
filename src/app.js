require("dotenv").config();
const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData, validateLogin } = require("./common/validations");
const { userAuth } = require("./middleware/auth");

const port = 3030;

app.use(express.json());
app.use(cookieParser());

// Create a user
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

// Get user profile
app.get("/profile", userAuth, async (req, res) => {
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

app.post("/sendConnection", userAuth, async (req, res) => {
  try {
    if (req.user) {
      res.status(200).send({
        from: `${req.user?.firstName} ${req.user?.lastName}`,
        message: "Connection request send!",
      });
    } else {
      throw new Error("You must be logged in to access this resource!");
    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message || `Something Went Wrong`,
    });
  }
});

connectDb()
  .then(() => {
    console.log("MongoDB connection successful");
    app.listen(port, () => {
      console.log(`App listening on port: ${port}`);
    });
  })
  .catch((err) => console.error("MongoDB Connection Failed", err));
