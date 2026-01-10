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

router.get("/add-one-cf", async (req, res) => {
  const contests = await getUpcomingCodeforcesContests();

  if (contests.length === 0) {
    return res.send("No upcoming contests");
  }

  const firstContest = contests[0];
  const event = buildCalendarEvent(firstContest);

  await createCalendarEvent(event);

  res.send(`Added contest: ${firstContest.name}`);
});

module.exports = router;
