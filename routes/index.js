const console = require("better-console");
const express = require("express");

const router = express.Router();

router.use("/", (req, res) => {
  const { sessionID, session, cookies } = req;

  console.log(req);
  console.log(cookies);
  console.log(sessionID);

  res.json({
    sessionID,
    session
  });
});

module.exports = router;
