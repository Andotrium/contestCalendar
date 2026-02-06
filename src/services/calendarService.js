const { google } = require("googleapis");
const fs = require("fs");
const creds = require("../config/credentials.json");
const path = require("path");
// const token = require("../config/token.json");
const dotenv = require("dotenv");
dotenv.config();

function getCalendarClient() {
  const tokenPath = path.join(__dirname, "../config/token.json");

  if (!fs.existsSync(tokenPath)) {
    throw new Error(
      "token.json not found. Please complete OAuth flow first."
    );
  }

  const token = JSON.parse(fs.readFileSync(tokenPath, "utf8"));

// Create OAuth2 client
const auth = new google.auth.OAuth2(
  creds.web.client_id,
  creds.web.client_secret,
  `http://localhost:${process.env.PORT}/oauth2callback`
);

// Attach stored tokens (includes refresh_token)
auth.setCredentials(token);

// Create Calendar client
const calendar = google.calendar({
  version: "v3",
  auth,
});

  return calendar;
}

/**
 * Create a Google Calendar event
 * @param {Object} event - Google Calendar event object
 */
async function createCalendarEvent(event) {
  const calendar = getCalendarClient();
  return calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });
}

module.exports = {
  createCalendarEvent,
};
