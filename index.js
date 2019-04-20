const console = require("better-console");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// const FileStore = require("session-file-store")(session);

const app = express();

app.use(cookieParser());

app.use(
  session({
    secret: "yourPrivateKey", // required
    // name: "yourCookieName", // The default value is 'connect.sid'
    cookie: {
      secure: false,
      maxAge: 600 * 1000 // 600 초
    }
  })
);

/**
 * FileStore 옵션의 TTL 보다  session.cookie.maxAge 가 우선순위가 높다.
 * 브라우저를 새로고침 해도 세션 파일은 그대로 이다. 브라우저의 쿠키를 삭제하거나 만료되면 세션 파일이 재생성 된다.
 */

// app.use(
//   session({
//     name: "yourCookieName", // The default value is 'connect.sid'
//     secret: "yourPrivateKey",
//     resave: false,
//     saveUninitialized: true, // false 이면
//     store: new FileStore({
//       ttl: 1 // Session time to live in seconds. Defaults to 3600
//     }),
//   })
// );

app.use("/", require("./routes"));

app.listen(3030, () => {
  console.log(`
  ===========================
    http://localhost:3030
  ===========================
  `);
});
