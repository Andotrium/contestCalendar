const axios = require("axios");

async function getUpcomingCodeforcesContests() {
  const res = await axios.get(
    "https://codeforces.com/api/contest.list"
  );

  return res.data.result
    .filter(c => c.phase === "BEFORE")
    .map(c => ({
      uniqueId: `cf-${c.id}`,
      platform: "Codeforces",
      id: c.id,
      name: c.name,
      startTime: new Date(c.startTimeSeconds * 1000),
      durationMs: c.durationSeconds * 1000,
      url: `https://codeforces.com/contest/${c.id}`,
    }))

}

module.exports = { getUpcomingCodeforcesContests };
