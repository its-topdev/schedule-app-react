const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    default: ""
  },
  firstName: {
    type: String,
    required: true,
    default: ""
  },
  lastName: {
    type: String,
    required: true,
    default: ""
  },
  role: {
    type: String,
    required: true,
    default: ""
  },
  children: {
    type: [this, { role: "child" }],
    required: this.role === "parent" ? true : false,
    default: this.role === "parent" ? [] : null
  },
  parents: {
    type: [this, { role: "parent" }],
    required: this.role === "child" ? true : false,
    default: this.role === "child" ? [] : null
  },
  dateRegistered: {
    type: Date,
    required: true,
    default: new Date()
  },
  wakeTime: {
    type: Date,
    required: this.role === "child" ? true : false,
    default: this.role === "child" ? new Date() : null
  },
  sleepTime: {
    type: Date,
    required: this.role === "child" ? true : false,
    default: this.role === "child" ? new Date() : null
  },
  breakfastTime: {
    type: Date,
    required: this.role === "child" ? true : false,
    default: this.role === "child" ? new Date() : null
  },
  lunchTime: {
    type: Date,
    required: this.role === "child" ? true : false,
    default: this.role === "child" ? new Date() : null
  },
  dinnerTime: {
    type: Date,
    required: this.role === "child" ? true : false,
    default: this.role === "child" ? new Date() : null
  }
});

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", UserSchema);

module.exports = User;