const path = require("path");
const User = require("./models/user");
const authConfig = require("./app/auth/passport");
const authentication = require("./app/auth/routes");
const bookApi = require("./app/api/books");
const settingsApi = require("./app/api/settings");
const tradeApi = require("./app/api/trade");
const routes = require("./app/routes");

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

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "client"));

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

app.use(express.static(path.join(process.cwd(), "build", "client")));

authConfig(passport, User);
app.use(passport.initialize());
app.use(passport.session());
app.use(authentication({ social: ["github", "twitter"] }));
app.use(bookApi());
app.use(settingsApi());
app.use(tradeApi());
app.use(routes());

app.listen(process.env.PORT, () => {
  console.log("listening on port: " + process.env.PORT);
});
