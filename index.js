const console = require("better-console");
const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

app.use(cookieParser());

// app.use(
//   session({
//     secret: "yourPrivateKey", // required
//     name: "yourCookieName", // The default value is 'connect.sid'
//     resave: false,
//     saveUninitialized: true, // false 이면
//     cookie: {
//       secure: false,
//       maxAge: 600 * 1000 // 600 초
//     }
//   })
// );

app.use(
  session({
    name: "yourCookieName", // The default value is 'connect.sid'
    secret: "yourPrivateKey",
    resave: false,
    saveUninitialized: true, // false 이면
    store: new FileStore()
  })
);

app.use("/", require("./routes"));

app.listen(3030, () => {
  console.log(`
  ===========================
    http://localhost:3030
  ===========================
  `);
});
