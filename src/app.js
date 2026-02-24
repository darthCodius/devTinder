const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const mongoose = require("mongoose");
const User = require("./models/user");

const port = 3030;

app.use(express.json());

// Create a user
app.post("/signup", async (req, res) => {
  // Creating a new instance of the User model
  const user = new User(req.body);
  try {
    await user.save();
    res.send({
      status: 200,
      message: "User Signed Up",
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Internal Server Error, ${error}`,
    });
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId }).exec();
    if (!user) {
      res.status(404).send({
        status: 404,
        message: "User not found",
      });
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Something Went Wrong`,
    });
  }
});

// Get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}).exec();
    res.send(users);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Something Went Wrong`,
    });
  }
});

// Delete a user
app.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid user ID Format",
      });
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    // Check if user exists
    if (!deletedUser) {
      return res.status(404).send({
        message: "User not found!",
      });
    }

    res.status(200).send({
      message: "User delete!",
      data: deletedUser,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Something Went Wrong`,
    });
  }
});

// Update data of a user

app.patch("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ObjectId in payload
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid user ID Format",
      });
    }

    // Extract the data to be updated
    const newUserData = req.body;

    // Update the data, returns the updated document
    const updatedData = await User.findByIdAndUpdate(id, newUserData, {
      new: true,
      upsert: false,
    });
    res.status(200).send({
      message: "User Updated Successfully",
      updatedData,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Something Went Wrong`,
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
