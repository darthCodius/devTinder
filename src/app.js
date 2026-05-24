require("dotenv").config();
const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDb()
  .then(() => {
    console.log("MongoDB connection successful");
    app.listen(process.env.PORT, () => {
      console.log(`App listening on port: ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB Connection Failed", err));
