const express = require("express");
const app = express();
const port = 3030;

app.get("/user", (req, res) => {
  const dummyUser = {
    name: "Abhinav Yadav",
    email: "test@gmail.com",
  };
  res.send(dummyUser);
});

app.post("/user", (req, res) => {
  console.log("Save user data");
  res.send({ success: true, message: "data saved!" });
});

app.delete("/user", (req, res) => {
  console.log("Delete user data");
  res.send({
    success: true,
    message: "deleted user data",
  });
});

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
