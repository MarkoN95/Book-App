const User = require("./models/user");
const authConfig = require("./app/auth/passport");
const authentication = require("./app/auth/routes");
const bookApi = require("./app/api/books");

const passport = require("passport");
const mongoose = require("mongoose");
const logger = require("connect-logger");

if(process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "config/.env"
  });
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI);

const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo")(session);

const express = require("express");
const app = express();

if(process.env.NODE_ENV !== "production") {
  app.use(logger());
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    maxAge: 12 * 24 * 60 * 60 * 1000 //2 weeks
  },
  resave: false,
  saveUninitialized: false
}));

authConfig(passport, User);
app.use(passport.initialize());
app.use(passport.session());
app.use(authentication({ social: ["github", "twitter"] }));
app.use(bookApi());

app.listen(process.env.PORT, () => {
  console.log("listening on port: " + process.env.PORT);
});
