function buildCalendarEvent(contest) {
  if (isNaN(contest.startTime.getTime())) {
  throw new Error(`Invalid startTime for ${contest.uniqueId}`);
}
  const start = contest.startTime;
  const end = new Date(start.getTime() + contest.durationMs);


  return {
    summary: `[${contest.platform}] ${contest.name}`,
    description: contest.url,
    start: {
      dateTime: start.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    reminders: {
      useDefault: false,
      overrides: [{ method: "popup", minutes: 30 }],
    },
  };
}

module.exports = { buildCalendarEvent };
