const { getUpcomingCodeforcesContests } = require("./services/codeforcesService");
const { getUpcomingAtCoderContests } = require("./services/atCoderService");
const { createCalendarEvent } = require("./services/calendarService");
const { buildCalendarEvent } = require("./utils/buildCalendarEvent");
const { isContestAdded, markContestAdded } = require("./utils/contestStore");

async function syncPlatform(contests) {
  let added = 0;

  for (const contest of contests) {
    const exists = await isContestAdded(contest.uniqueId);
    if (exists) continue;

    await createCalendarEvent(buildCalendarEvent(contest));
    await markContestAdded(contest);
    added++;
  }

  return added;
}

async function main() {
  console.log("Starting contest sync...");

  const cfContests = await getUpcomingCodeforcesContests();
  const acContests = await getUpcomingAtCoderContests();

  const cfAdded = await syncPlatform(cfContests);
  const acAdded = await syncPlatform(acContests);

  console.log(`Codeforces added: ${cfAdded}`);
  console.log(`AtCoder added: ${acAdded}`);
  console.log("Sync complete.");
}

main().catch(err => {
  console.error("Sync failed:", err);
  process.exit(1);
});
