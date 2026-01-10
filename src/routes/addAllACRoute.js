const express = require("express");
const router = express.Router();

const {
  getUpcomingAtCoderContests,
} = require("../services/atCoderService");

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

router.get("/add-all-ac", async (req, res) => {
  const contests = await getUpcomingAtCoderContests();
  let added = 0;

  for (const contest of contests) {
    const exists = await isContestAdded(contest.uniqueId);
    if (exists) continue;

    await createCalendarEvent(buildCalendarEvent(contest));
    await markContestAdded(contest);
    added++;
  }

  res.send(`Added ${added} AtCoder contests`);
});
// router.get("/add-all-ac", async (req, res) => {
//   const contests = await getUpcomingAtCoderContests();
//   console.log(contests.slice(0, 2)); // 👈 ADD THIS
//   res.json(contests.slice(0, 2));
// });


module.exports = router;
