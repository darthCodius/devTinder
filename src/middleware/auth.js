const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Method to authenticate token
// const authenticateToken = (req, res, next) => {
//   try {
//     const cookies = req.cookies;
//     const { token } = cookies;

//     if (!token) throw new Error("Invalid Token");

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req._id = decoded._id;
//     next();
//   } catch (error) {
//     res.status(400).send({
//       message: error.message || "Someting went wrong!",
//     });
//   }
// };

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid Token!");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decoded;

    const user = await User.findById(_id);

    if (!user) throw new Error("User not found!");

    req.user = user;

    next();
  } catch (error) {
    res.status(400).send({
      message: error.message || "Something went wrong!",
    });
  }
};

module.exports = {
  userAuth,
};
