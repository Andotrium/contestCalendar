const dotenv = require('dotenv');
const path = require("path");
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const creds = require("./config/credentials.json");
const cfRoute = require('./routes/codeforcesRoute');
const buildCalendarEvent = require('./routes/addOnecfRound');
const addAllCFRoute = require('./routes/addAllCFRoute');
const addAllACRoute = require('./routes/addAllACRoute');

const app = express();

const oauth2Client = new google.auth.OAuth2(
  creds.web.client_id,
  creds.web.client_secret,
  `http://localhost:${process.env.PORT}/oauth2callback`
);

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  if (!code) {
    return res.send("No code found");
  }

  // Verify state parameter to prevent CSRF
  const statePath = path.join(__dirname, "config/oauth_state.json");
  if (fs.existsSync(statePath)) {
    const savedState = JSON.parse(fs.readFileSync(statePath, "utf8")).state;
    if (state !== savedState) {
      return res.status(403).send("Invalid state parameter");
    }
    fs.unlinkSync(statePath);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    fs.writeFileSync(
      path.join(__dirname, "config/token.json"),
      JSON.stringify(tokens, null, 2)
    );
    res.send("Authorization successful. You can close this tab.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Auth failed");
  }
});

app.use("/api", cfRoute); // for fetching cf contests
app.use("/api", buildCalendarEvent); // for only one cf round
app.use("/api", addAllCFRoute); // for all cf rounds
app.use("/api", addAllACRoute); // for all ac rounds

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
