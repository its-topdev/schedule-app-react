const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const connectDB = require("./config/db");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { SESSION_SECRET, MONGO_URI } = process.env;
const User = require("./models/User");
const { v4: uuidv4 } = require("uuid");

const taskRouter = require("./routes/api/tasks");
const userRouter = require("./routes/api/users");

const app = express();

const CLIENT_URL = "https://task-scheduler-dragonosman.vercel.app";
const whitelist = [CLIENT_URL];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Connection"],
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"]
};
app.use(cors(corsOptions));

connectDB();

app.use(session({
  genid: req => uuidv4(),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    uri: MONGO_URI,
    collection: "task-sessions"
  }),
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false,
    sameSite: false,
    signed: true
  }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => res.send(req.sessionID));

const port = process.env.PORT || 3000;

app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));