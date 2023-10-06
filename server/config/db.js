const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_URI } = process.env;

const connectDB = () => {
  try {
    mongoose.connect(MONGO_URI);
    mongoose.connection.on("error", () => console.log("an error occurred!"))
      .on("disconnected", () => console.log("disconnected from database!"))
    ;
    console.log("database connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;