const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to DB");
};

module.exports = {
  connectDB,
};
