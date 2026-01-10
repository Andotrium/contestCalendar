const dotenv = require("dotenv");
dotenv.config();
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const creds = require("./credentials.json");

const oauth2Client = new google.auth.OAuth2(
  creds.web.client_id,
  creds.web.client_secret,
  `http://localhost:${process.env.PORT}/oauth2callback`
);

// Generate URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/calendar"],
  prompt: "consent",
});

console.log("Authorize this app by visiting this url:");
console.log(authUrl);
