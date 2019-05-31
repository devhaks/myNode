const console = require("better-console");
const express = require("express");

const router = express.Router();

// router.use("/", (req, res) => {
//   const { sessionID, cookies } = req;

//   console.log(sessionID);
//   console.log(cookies);

//   res.json({
//     sessionID,
//     cookies
//   });
// });

router.use("/auth/kakao", require("./auth/kakao"));

// http://localhost:8888/
router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
