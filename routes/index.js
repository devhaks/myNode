const console = require("better-console");
const express = require("express");

const router = express.Router();

router.use("/", (req, res) => {
  const { sessionID, cookies } = req;

  console.log(sessionID);
  console.log(cookies);

  res.json({
    sessionID,
    cookies
  });
});

module.exports = router;
