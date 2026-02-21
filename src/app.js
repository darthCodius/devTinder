const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const User = require("./models/user");

const port = 3030;

app.use(express.json());

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

connectDb()
  .then(() => {
    console.log("MongoDB connection successful");
    app.listen(port, () => {
      console.log(`App listening on port: ${port}`);
    });
  })
  .catch((err) => console.error("MongoDB Connection Failed", err));
