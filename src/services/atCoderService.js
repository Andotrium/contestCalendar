function parseDurationToMs(durationStr) {
  // "02:00" → 2 hours
  const [hours, minutes] = durationStr.split(":").map(Number);
  return (hours * 60 + minutes) * 60 * 1000;
}

async function getUpcomingAtCoderContests() {
  const {
    fetchUpcomingContests,
  } = require("@qatadaazzeh/atcoder-api");

  const upcoming = await fetchUpcomingContests();

  return upcoming.map(c => ({
    uniqueId: `ac-${c.contestId}`,
    platform: "AtCoder",
    id: c.contestId,
    name: c.contestName,
    // Date constructor correctly parses timezone "+0900"
    startTime: new Date(c.contestTime),
    durationMs: parseDurationToMs(c.contestDuration),
    url: c.contestUrl,
  }));
}

module.exports = {
  getUpcomingAtCoderContests,
};

