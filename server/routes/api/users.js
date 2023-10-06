const express = require("express");
const userRouter = express.Router();
const User = require("../../models/User");
const connectEnsureLogin = require("connect-ensure-login");
const passport = require("passport");

const validateRegisterInput = require("../../user-validation/register");
const validateLoginInput = require("../../user-validation/login");

userRouter.post("/register", (req, res) => {
  try {
    const { isValid, errors } = validateRegisterInput(req.body);
    if (!isValid) {
      res.statusCode = 400;
      if (errors.password) {
        res.json({ error: errors.password });
        console.log(`error: ${errors.password}`);
        return;
      } else if (errors.confirmPassword) {
        res.json({ error: errors.confirmPassword });
        console.log(`error: ${errors.confirmPassword}`);
        return;
      } else if (errors.username) {
        res.json({ error: errors.username });
        console.log(`error: ${errors.username}`);
        return;
      } else if (errors.firstName) {
        res.json({ error: errors.firstName });
        console.log(`error: ${errors.firstName}`);
        return;
      } else if (errors.lastName) {
        res.json({ error: errors.lastName });
        console.log(`error: ${errors.lastName}`);
        return;
      }
    } else {
      User.register(new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role
      }), req.body.password, async (err, user) => {
        if (err) {
          res.status(500).json({ error: err, success: false });
          console.log(err);
        }

        try {
          if (user) {
            await user.save();
            res.status(200).json({ success: true, message: "you are registered!", user });
          }
        } catch (err) {
          console.log(err);
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ error: err, success: false });
  }
});

userRouter.post("/login", passport.authenticate("local"), async (req, res, next) => {
  try {
    const { isValid, errors } = validateLoginInput(req.body);
    if (!isValid) {
      res.statusCode = 400;
      if (errors.username) {
        res.json({ error: errors.username });
        console.log(`In login route, errors.username check: ${errors.username}`);
        return;
      } else if (errors.password) {
        res.json({ error: errors.password });
        console.log(`In login route, errors.password check: ${errors.password}`);
        return;
      }
    }
    const user = await User.findById(req.user._id);
    if (user) {
      try {
        await user.save();
        res.json({ success: true, user });
      } catch (err) {
        res.status(500).json({ error: err, success: false });
      }
    } else {
      res.status(401).json({ message: "Unauthorized: User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
    return next(err);
  }
});

userRouter.get("/logout", connectEnsureLogin.ensureLoggedIn(), (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

userRouter.get("/user-details", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

userRouter.delete("/delete-user", connectEnsureLogin.ensureLoggedIn(), async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (deletedUser) {
      res.status(200).json({ success: true, message: "Account deleted successfully" });
    }
  } catch (err) {
    console.error(`Error deleting account: ${err}`);
    return next(err);
  }
});

userRouter.put("/edit-user", connectEnsureLogin.ensureLoggedIn(), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body);
    if (user) {
      res.status(200).json({ success: true, message: "Account editd successfully" });
    }
  } catch (err) {
    console.error(`Error editing account: ${err}`);
    return next(err);
  }
});

module.exports = userRouter;