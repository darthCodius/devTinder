const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://learnernode:3GojAJExtRRxamPv@namastenode.paf02vg.mongodb.net/devTinder",
  );
};

module.exports = {
  connectDb,
};
