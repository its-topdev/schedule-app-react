const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
    default: ""
  },
  text: {
    type: String,
    required: false,
    default: ""
  },
  startTime: {
    type: String,
    required: false,
    default: ""
  },
  endTime: {
    type: String,
    required: false,
    default: ""
  },
  startDate: {
    type: Date,
    required: true,
    default: new Date()
  },
  endDate: {
    type: Date,
    required: true,
    default: new Date()
  },
  start: {
    type: Date,
    required: true,
    default: new Date()
  },
  end: {
    type: Date,
    required: true,
    default: new Date()
  },
  timer: {
    type: String,
    required: false,
    default: ""
  },
  time: {
    type: String,
    required: false,
    default: ""
  },
  scheduled: {
    type: Boolean,
    required: false,
    default: false
  },
  flexible: {
    type: Boolean,
    required: false,
    default: false
  },
  isRecurring: {
    type: Boolean,
    default: false,
    required: true
  },
  daysRecurring: {
    type: [String],
    default: [],
    required: false
  },
  isCompleted: {
    type: Boolean,
    default: false,
    required: true
  },
  userId: {
    type: Schema.ObjectId,
    required: true
  },
  rRule: {
    type: String,
    required: false,
    default: ""
  }
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;