const express = require("express");
const router = express.Router();
const {
  getUpcomingCodeforcesContests,
} = require("../services/codeforcesService");

router.get("/codeforces", async (req, res) => {
  const contests = await getUpcomingCodeforcesContests();
  res.json(contests);
});

module.exports = router;
