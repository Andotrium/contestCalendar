const express = require("express");
const router = express.Router();

const {
  getUpcomingCodeforcesContests,
} = require("../services/codeforcesService");

const {
  createCalendarEvent,
} = require("../services/calendarService");

const {
  buildCalendarEvent,
} = require("../utils/buildCalendarEvent");

const {
  isContestAdded,
  markContestAdded,
} = require("../utils/contestStore");

router.get("/add-all-cf", async (req, res) => {
  const contests = await getUpcomingCodeforcesContests();
  let added = 0;

  for (const contest of contests) {
    const exists = await isContestAdded(contest.uniqueId);
    if (exists) continue;

    await createCalendarEvent(buildCalendarEvent(contest));
    await markContestAdded(contest);
    added++;
  }

  res.send(`Added ${added} Codeforces contests`);
});

module.exports = router;
