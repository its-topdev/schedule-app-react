const express = require("express");
const taskRouter = express.Router();
const Task = require("../../models/Task");
const User = require("../../models/User");
const path = require("path");
const fs = require("fs");

// initialize tasks array in database with tasks
// or edit tasks with updated ones if needed if
// database already has tasks
const addOrEditTasksInDB = async (req, calledInAdd) => {
  try {
    if (req.isAuthenticated()) {
      const userId = req.user._id;

      if (isEmpty) {
        const tasks = data.Amira.Chores.map((task) => ({
          ...task,
          userId,
          startTime: createDateFromTimeString(task.startTime),
          endTime: createDateFromTimeString(task.endTime),
        }));
        await Task.insertMany(tasks);

        if (calledInAdd) {
          return;
        }
      } else {
        if (!calledInAdd) {
          const operations = data.Amira.Chores.map((task) => ({
            updateOne: {
              filter: { title: task.title },
              update: {
                ...task,
                startTime: createDateFromTimeString(task.startTime),
                endTime: createDateFromTimeString(task.endTime),
              },
              upsert: true,
            },
          }));
          await Task.bulkWrite(operations);
        }
      }

      const isEmpty = await Task.countDocuments({ userId }) === 0;
    }
  } catch (err) {
    console.log(`Failed to add or update tasks in db: ${err}`);
  }
};

const createDateFromTimeString = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));
  date.setSeconds(parseInt(seconds));
  return date;
};

// Read the JSON file
const dataFilePath = path.join(__dirname, "../../", "data.json");
const rawData = fs.readFileSync(dataFilePath);
const data = JSON.parse(rawData);

taskRouter.post("/add-task", async (req, res, next) => {
  try {
    const user = User.findOne({ firstName: "Amira", lastName: "Naeem" });
    if (user) {
      await addOrEditTasksInDB(req, true);
    } else {
      if (req.isAuthenticated()) {
        const userId = req.user._id;
        const task = await Task.create({ ...req.body, userId });
        res.status(200).json({ success: true, message: "Task added successfully", task });
      }
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err, message: "Could not add your task" });
    return next(err);
  }
});

taskRouter.get("/", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const user = req.user;
      const userId = user._id;
      const tasks = await Task.find({ userId });
      res.status(200).json({ success: true, tasks });
    }
  } catch (err) {
    res.status(404).json({ success: false, error: err, message: "No tasks found" });
    return next(err);
  }
});

taskRouter.get("/task-details/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    res.status(200).json({ success: true, message: "Task found successfully", task });
  } catch (err) {
    res.status(404).json({ success: false, error: err, message: "Task not found" });
    return next(err);
  }
});

taskRouter.put("/edit-task/:id", async (req, res, next) => {
  try {
    const user = User.findOne({ firstName: "Amira", lastName: "Naeem" });
    if (user) {
      await addOrEditTasksInDB(req, false);
    }
    const taskId = req.params.id;
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body);
    res.status(200).json({ success: true, message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    res.status(400).json({ success: false, error: err, message: "Could not update task" });
    return next(err);
  }
});

taskRouter.delete("/delete-task/:id", async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByIdAndRemove(taskId);
    res.status(200).json({ success: true, message: "Task deleted successfully", task });
  } catch (err) {
    res.status(404).json({ success: false, error: err, message: "Failed to delete task" });
    return next(err);
  }
});

module.exports = taskRouter;