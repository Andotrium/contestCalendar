const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
const { google } = require("googleapis");
const fs = require("fs");

const creds = require("./credentials.json");

const oauth2Client = new google.auth.OAuth2(
  creds.web.client_id,
  creds.web.client_secret,
  `http://localhost:${process.env.PORT}/oauth2callback`
);

const crypto = require("crypto");
const state = crypto.randomBytes(32).toString("hex");

// Save state so the server can verify it
fs.writeFileSync(
  path.join(__dirname, "oauth_state.json"),
  JSON.stringify({ state })
);

// Generate URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/calendar"],
  prompt: "consent",
  state: state,
});

console.log("Authorize this app by visiting this url:");
console.log(authUrl);
