"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _path = _interopRequireDefault(require("path"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _helmet = _interopRequireDefault(require("helmet"));

var _passport = _interopRequireDefault(require("./helpers/passport"));

var _expressValidator = _interopRequireDefault(require("express-validator"));

var _http = _interopRequireDefault(require("http"));

var _dailyViews = _interopRequireDefault(require("./helpers/_dailyViews"));

var _install = _interopRequireDefault(require("./helpers/install"));

var _index = _interopRequireDefault(require("./routes/index"));

var _article = _interopRequireDefault(require("./routes/article"));

var _category = _interopRequireDefault(require("./routes/category"));

var _media = _interopRequireDefault(require("./routes/media"));

var _users2 = _interopRequireDefault(require("./routes/users"));

var _newsletter = _interopRequireDefault(require("./routes/newsletter"));

var _settings = _interopRequireDefault(require("./routes/settings"));

var _contact = _interopRequireDefault(require("./routes/contact"));

var _users3 = _interopRequireDefault(require("./routes/_users"));

var _comments = _interopRequireDefault(require("./routes/comments"));

var _admin = _interopRequireDefault(require("./routes/admin"));

var _tags = _interopRequireDefault(require("./routes/tags"));

var _announcement = _interopRequireDefault(require("./routes/announcement"));

var _pages = _interopRequireDefault(require("./routes/pages"));

var _ads = _interopRequireDefault(require("./routes/ads"));

var _menu = _interopRequireDefault(require("./routes/menu"));

var _bookmark = _interopRequireDefault(require("./routes/bookmark"));

var MongoStore = require("connect-mongo")(_expressSession["default"]); // Load environment variables from.env file, where API keys and passwords are configured.

_dotenv["default"].config({
  path: "./.env"
});

var app = (0, _express["default"])();
var port = process.env.PORT || 3000;

var server = _http["default"].createServer(app);

server.listen(port, function() {
  return console.log("App started on port: ".concat(port));
});
server.on("connection", function(socket) {
  socket.setTimeout(600 * 60 * 1000); // now works perfectly...
}); //Load views directory and view engine

app.set("views", _path["default"].join(__dirname, "views"));
app.set("view engine", "ejs"); // Mongoose options

var options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};

_mongoose["default"]
  .connect(process.env.MONGODB_ONLINE_DB, options)
  .then(function(connected) {
    return console.log("Database connection established");
  })
  ["catch"](function(err) {
    return console.error(
      "There was an error connecting to database, the err is ".concat(err)
    );
  }); // Import all routes

//Init express session
// Helmet config
app.use((0, _helmet["default"])());
app.use((0, _morgan["default"])("dev"));
app.use(
  _express["default"].json({
    limit: "900mb"
  })
);
app.use(
  _express["default"].urlencoded({
    extended: false,
    limit: "900mb"
  })
);
app.use((0, _expressValidator["default"])());
app.use((0, _cookieParser["default"])());
app.use(
  (0, _expressSession["default"])({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1209600000
    },
    store: new MongoStore({
      url: process.env.MONGODB_ONLINE_DB,
      autoReconnect: true
    })
  })
);
app.use(function(req, res, next) {
  res.header("X-powered-by", "Dype");
  next();
});
app.use(function(req, res, next) {
  res.header("server", "Dype");
  next();
}); //Initialize passport

app.use(_passport["default"].initialize());
app.use(_passport["default"].session()); //Set the public folder

app.use(
  _express["default"]["static"](_path["default"].join(__dirname, "public"))
); // Use all routers

app.use(_index["default"]);
app.use(_article["default"]);
app.use(_category["default"]);
app.use(_media["default"]);
app.use(_users2["default"]);
app.use(_newsletter["default"]);
app.use(_settings["default"]);
app.use(_contact["default"]);
app.use(_users3["default"]);
app.use(_comments["default"]);
app.use(_admin["default"]);
app.use(_tags["default"]);
app.use(_announcement["default"]);
app.use(_pages["default"]);
app.use(_ads["default"]);
app.use(_menu["default"]);
app.use(_bookmark["default"]);
app.use(_install["default"].redirectToLogin, function(req, res, next) {
  if (res.status(404)) {
    res.render("404");
  }
}); //Error handling

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
