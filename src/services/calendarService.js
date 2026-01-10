const { google } = require("googleapis");
const creds = require("../config/credentials.json");
const token = require("../config/token.json");
const dotenv = require("dotenv");
dotenv.config();

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

/**
 * Create a Google Calendar event
 * @param {Object} event - Google Calendar event object
 */
async function createCalendarEvent(event) {
  return calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });
}

module.exports = {
  createCalendarEvent,
};
