const http = require("http");
const express = require("express");

const app = express();
const console = require("better-console");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

app.use(cookieParser());

app.use(
  session({
    name: "devhaksCookie", // The default value is 'connect.sid'
    secret: "yourPrivateKey",
    resave: false,
    saveUninitialized: true, // false 이면
    store: new FileStore()
  })
);

app.use(function(req, res, next) {
  const { session } = req;

  // if (session.views) {
  //   session.views += 1;
  // } else {
  //   session.views = 1;
  // }

  // console.log(session.id, session.views);

  next();
});

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", require("./routes"));

const httpServer = http.createServer(app);

httpServer.listen(8888, () => {
  console.log(`
  ===========================
    http://localhost:8888
  ===========================
  `);
});
