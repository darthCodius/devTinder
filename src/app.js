const express = require("express");
const app = express();
const port = 3030;

const { adminAuth, userAuth } = require("./middleware/auth");

// Middleware for all request coming to the /admin routes
app.use("/admin", adminAuth);

app.get("/user/login", (req, res) => {
  res.send({
    message: "User logged in!",
    data: {},
  });
});

app.use("/user/data", userAuth);

app.get("/admin/getalldata", (req, res) => {
  res.send({
    message: "Sent all data",
    data: {},
  });
});

app.delete("/admin/deletealldata", (req, res) => {
  res.send({
    message: "Deleted all data",
  });
});

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
