var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var udp = require("dgram");
const server = udp.createSocket("udp4");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");

var app = express();
var { mongoose } = require("./src/Services/mongooes");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "mongodb"));
db.once("open", () => console.log("DB connected.........."));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);

app.use(
  "/adminpanel",
  express.static(path.join(__dirname, "dist", "adminpanel"))
);
app.get("/adminpanel/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "adminpanel", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// udp connection

// server.on("error", (err) => {
//   console.log(`server error:\n${err.stack}`);
//   server.close();
// });

// server.on("message", (msg, rinfo) => {
//   console.log(`server got: ${msg} from ${`239.70.70.71`}:${`17741`}`);
// });

// server.on("listening", () => {
//   const address = server.address();
//   console.log(`server listening ${address.address}:${address.port}`);
// });

// server.bind({
//   address: "http://239.50.51.21",
//   port: 8080,
//   exclusive: true,
// });

// end udp connection

module.exports = app;
