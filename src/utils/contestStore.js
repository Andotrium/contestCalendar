const db = require("./db");

function isContestAdded(id) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id FROM added_contests WHERE id = ?",
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(!!row);
      }
    );
  });
}

function markContestAdded(contest) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO added_contests (id, platform, name, start_time)
       VALUES (?, ?, ?, ?)`,
      [
        contest.uniqueId,
        contest.platform,
        contest.name,
        contest.startTime.toISOString(),
      ],
      err => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

module.exports = {
  isContestAdded,
  markContestAdded,
};
