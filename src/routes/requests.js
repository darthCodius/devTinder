const express = require("express");

const requestsRouter = express.Router();
const { userAuth } = require("../middleware/auth");

requestsRouter.post("/sendConnection", userAuth, async (req, res) => {
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

module.exports = requestsRouter;
