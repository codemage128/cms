"use strict";

import express from "express";
import createError from "http-errors";
import logger from "morgan";
import session from "express-session";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import passport from "./helpers/passport";
import expressValidator from "express-validator";
import http from "http";
import _view from "./helpers/_dailyViews";
import install from "./helpers/install";
// const MongoStore = require("connect-mongo")(session);

// Load environment variables from.env file, where API keys and passwords are configured.
dotenv.config({ path: "./.env" });

const app = express();

const port = process.env.PORT || 3000;

let server = http.createServer(app);
server.listen(port, () => console.log(`App started on port: ${port}`));
server.on("connection", function(socket) {
  socket.setTimeout(600 * 60 * 1000); // now works perfectly...
});

//Load views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Mongoose options
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};
mongoose
  .connect(process.env.MONGODB_ONLINE_DB, options)
  .then(connected => console.log(`Database connection established`))
  .catch(err =>
    console.error(
      `There was an error connecting to database, the err is ${err}`
    )
  );

// Import all routes
import index from "./routes/index";
import article from "./routes/article";
import category from "./routes/category";
import media from "./routes/media";
import users from "./routes/users";
import newsletter from "./routes/newsletter";
import settings from "./routes/settings";
import contact from "./routes/contact";
import _users from "./routes/_users";
import comment from "./routes/comments";
import admin from "./routes/admin";
import tags from "./routes/tags";
import announcement from "./routes/announcement";
import pages from "./routes/pages";
import ads from "./routes/ads";
import menu from "./routes/menu";
import bookmark from "./routes/bookmark";

//Init express session
// Helmet config
app.use(helmet());
app.use(logger("dev"));
app.use(express.json({ limit: "900mb" }));
app.use(express.urlencoded({ extended: false, limit: "900mb" }));
app.use(expressValidator());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1209600000
    }
  })
);

app.use(function(req, res, next) {
  res.header("X-powered-by", "Dype");
  next();
});

app.use((req, res, next) => {
  res.header("server", "Dype");
  next();
});

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Set the public folder
app.use(express.static(path.join(__dirname, "public")));

// Use all routers
app.use(index);
app.use(article);
app.use(category);
app.use(media);
app.use(users);
app.use(newsletter);
app.use(settings);
app.use(contact);
app.use(_users);
app.use(comment);
app.use(admin);
app.use(tags);
app.use(announcement);
app.use(pages);
app.use(ads);
app.use(menu);
app.use(bookmark);

app.use(install.redirectToLogin, (req, res, next) => {
  if (res.status(404)) {
    res.render("404");
  }
});

//Error handling
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
