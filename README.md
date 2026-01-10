# Contest Calendar

An automated system that fetches upcoming programming contests from **Codeforces** and **AtCoder**, and syncs them directly to your **Google Calendar**. Never miss a contest again!

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Google OAuth Setup](#google-oauth-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [GitHub Actions (Automated Sync)](#github-actions-automated-sync)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)

---

## Overview

**Contest Calendar** is a Node.js application that automatically:

1. Fetches upcoming contests from Codeforces and AtCoder APIs
2. Creates Google Calendar events for each contest
3. Tracks which contests have been added to prevent duplicates
4. Runs automatically every 6 hours via GitHub Actions

The system can also be run locally via an Express server with REST API endpoints for manual control.

---

## Features

- **Multi-Platform Support** - Syncs contests from both Codeforces and AtCoder
- **Automatic Scheduling** - GitHub Actions workflow runs every 6 hours
- **Duplicate Prevention** - SQLite database tracks added contests to avoid duplicates
- **Google Calendar Integration** - Creates events with contest details, URLs, and reminders
- **REST API** - Manual endpoints for fetching and adding contests
- **Persistent Storage** - Database is committed to Git for persistence across workflow runs
- **30-Minute Reminders** - Each calendar event includes a popup reminder

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js v20** | JavaScript runtime |
| **Express.js v5** | REST API server |
| **googleapis** | Google Calendar API client |
| **axios** | HTTP client for API requests |
| **sqlite3** | Lightweight database for tracking |
| **node-cron** | Background task scheduling |
| **dotenv** | Environment variable management |
| **@qatadaazzeh/atcoder-api** | AtCoder API wrapper |

---

## Project Structure

```
contestCalendar/
├── .github/
│   └── workflows/
│       └── contest-sync.yml      # GitHub Actions workflow
├── src/
│   ├── app.js                    # Express server entry point
│   ├── syncContests.js           # Automated sync script
│   ├── config/
│   │   ├── auth.js               # OAuth2 authentication setup
│   │   ├── credentials.json      # Google OAuth credentials (gitignored)
│   │   └── token.json            # OAuth tokens (gitignored)
│   ├── services/
│   │   ├── codeforcesService.js  # Codeforces API integration
│   │   ├── atCoderService.js     # AtCoder API integration
│   │   └── calendarService.js    # Google Calendar API integration
│   ├── routes/
│   │   ├── codeforcesRoute.js    # GET /api/codeforces
│   │   ├── addOnecfRound.js      # GET /api/add-one-cf
│   │   ├── addAllCFRoute.js      # GET /api/add-all-cf
│   │   └── addAllACRoute.js      # GET /api/add-all-ac
│   └── utils/
│       ├── db.js                 # SQLite database initialization
│       ├── buildCalendarEvent.js # Calendar event builder
│       └── contestStore.js       # Database queries
├── data.db                       # SQLite database file
├── package.json                  # Dependencies and scripts
├── .env                          # Environment variables (gitignored)
└── .gitignore                    # Git ignore rules
```

---

## Prerequisites

Before setting up the project, ensure you have:

1. **Node.js v20 or higher** - [Download](https://nodejs.org/)
2. **Google Cloud Project** - [Console](https://console.cloud.google.com/)
3. **Google Calendar API enabled** - In your Google Cloud project
4. **Git** - For version control

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/contestCalendar.git
cd contestCalendar
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the project root:

```env
PORT=8080
CLIENT_ID=your_google_client_id_here
```

---

## Google OAuth Setup

To interact with Google Calendar, you need to set up OAuth2 credentials.

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Create Project** and give it a name
3. Select the project once created

### Step 2: Enable Google Calendar API

1. In the sidebar, go to **APIs & Services** > **Library**
2. Search for "Google Calendar API"
3. Click **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type (or Internal if using Google Workspace)
3. Fill in the required fields:
   - App name: `Contest Calendar`
   - User support email: Your email
   - Developer contact: Your email
4. Click **Save and Continue**
5. On the **Scopes** page, click **Add or Remove Scopes**
6. Add `https://www.googleapis.com/auth/calendar`
7. Save and continue through the remaining steps

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Add **Authorized redirect URIs**:
   - `http://localhost:8080/oauth2callback`
5. Click **Create**
6. Download the JSON file

### Step 5: Configure Credentials

1. Rename the downloaded file to `credentials.json`
2. Move it to `src/config/credentials.json`

The file should look like this:

```json
{
  "web": {
    "client_id": "your-client-id.apps.googleusercontent.com",
    "project_id": "your-project-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "your-client-secret",
    "redirect_uris": ["http://localhost:8080/oauth2callback"]
  }
}
```

### Step 6: Generate Access Tokens

1. Run the authentication script:

```bash
node src/config/auth.js
```

2. A URL will be printed to the console
3. Open the URL in your browser
4. Sign in with your Google account
5. Grant calendar access permissions
6. You'll be redirected to `localhost:8080/oauth2callback`
7. A `token.json` file will be created in `src/config/`

---

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 8080) | No |
| `CLIENT_ID` | Google OAuth Client ID | Yes |

### Config Files

| File | Description |
|------|-------------|
| `src/config/credentials.json` | Google OAuth client credentials |
| `src/config/token.json` | OAuth access and refresh tokens |

---

## Running the Application

### Local Express Server

Start the Express server for manual API access:

```bash
node src/app.js
```

The server will start at `http://localhost:8080`

### Manual Sync Script

Run the sync script directly to add contests to your calendar:

```bash
node src/syncContests.js
```

This will:
1. Fetch all upcoming contests from Codeforces and AtCoder
2. Check which contests haven't been added yet
3. Create Google Calendar events for new contests
4. Update the database to track added contests

---

## GitHub Actions (Automated Sync)

The repository includes a GitHub Actions workflow that automatically syncs contests every 6 hours.

### Setting Up GitHub Actions

#### Step 1: Encode Credentials as Base64

Encode your credentials files:

```bash
# On macOS/Linux
base64 -i src/config/credentials.json | tr -d '\n'
base64 -i src/config/token.json | tr -d '\n'

# On Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("src/config/credentials.json"))
[Convert]::ToBase64String([IO.File]::ReadAllBytes("src/config/token.json"))
```

#### Step 2: Add GitHub Secrets

Go to your repository **Settings** > **Secrets and variables** > **Actions** and add:

| Secret Name | Value |
|-------------|-------|
| `GOOGLE_CREDENTIALS_B64` | Base64-encoded `credentials.json` |
| `GOOGLE_TOKEN_B64` | Base64-encoded `token.json` |

#### Step 3: Workflow Configuration

The workflow file (`.github/workflows/contest-sync.yml`) is already configured:

```yaml
name: Sync Contests

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:        # Manual trigger

permissions:
  contents: write

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm install

      - name: Create credentials
        run: |
          echo "${{ secrets.GOOGLE_CREDENTIALS_B64 }}" | base64 -d > src/config/credentials.json
          echo "${{ secrets.GOOGLE_TOKEN_B64 }}" | base64 -d > src/config/token.json

      - run: node src/syncContests.js

      - name: Commit database
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          if [ -n "$(git status --porcelain data.db)" ]; then
            git add data.db
            git commit -m "database persistence added"
            git push
          fi
```

#### Manual Trigger

You can manually trigger the workflow:

1. Go to **Actions** tab in your repository
2. Select "Sync Contests" workflow
3. Click **Run workflow**

---

## API Endpoints

When running the Express server, these endpoints are available:

### GET /api/codeforces

Fetches upcoming Codeforces contests.

**Response:**
```json
[
  {
    "id": 1234,
    "name": "Codeforces Round #900 (Div. 2)",
    "startTimeSeconds": 1704067200,
    "durationSeconds": 7200,
    "phase": "BEFORE"
  }
]
```

### GET /api/add-one-cf

Adds the next upcoming Codeforces contest to Google Calendar.

**Response:**
```
Added: Codeforces Round #900 (Div. 2)
```

### GET /api/add-all-cf

Adds all upcoming Codeforces contests to Google Calendar.

**Response:**
```
Added 5 Codeforces contests to calendar
```

### GET /api/add-all-ac

Adds all upcoming AtCoder contests to Google Calendar.

**Response:**
```
Added 3 AtCoder contests to calendar
```

### GET /oauth2callback

OAuth2 callback endpoint. Used during initial authorization.

---

## How It Works

### Data Flow

```
┌─────────────────┐     ┌─────────────────┐
│   Codeforces    │     │    AtCoder      │
│      API        │     │     API         │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Service Layer       │
         │  (Fetch & Transform)  │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   SQLite Database     │
         │  (Duplicate Check)    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Google Calendar     │
         │   (Create Events)     │
         └───────────────────────┘
```

### Contest Processing

1. **Fetch**: Retrieve upcoming contests from APIs
2. **Filter**: Only process contests that haven't started yet
3. **Check**: Query database to see if contest was already added
4. **Create**: Build calendar event with:
   - Title: `[Platform] Contest Name`
   - Description: Contest URL
   - Start/End times based on duration
   - 30-minute popup reminder
5. **Track**: Save contest ID to database

### Calendar Event Format

Each event is created with:

```javascript
{
  summary: "[Codeforces] Round #900 (Div. 2)",
  description: "https://codeforces.com/contest/1234",
  start: {
    dateTime: "2024-01-01T17:35:00",
    timeZone: "Asia/Kolkata"
  },
  end: {
    dateTime: "2024-01-01T19:35:00",
    timeZone: "Asia/Kolkata"
  },
  reminders: {
    useDefault: false,
    overrides: [
      { method: "popup", minutes: 30 }
    ]
  }
}
```

---

## Database Schema

The SQLite database (`data.db`) uses a single table:

```sql
CREATE TABLE added_contests (
  id TEXT PRIMARY KEY,    -- "cf-1234" or "ac-abc123"
  platform TEXT,          -- "Codeforces" or "AtCoder"
  name TEXT,              -- Contest name
  start_time TEXT         -- ISO 8601 timestamp
);
```

### Example Records

| id | platform | name | start_time |
|----|----------|------|------------|
| cf-1234 | Codeforces | Round #900 (Div. 2) | 2024-01-01T17:35:00Z |
| ac-abc340 | AtCoder | ABC 340 | 2024-01-06T12:00:00Z |

---

## Troubleshooting

### "Invalid credentials" Error

- Ensure `credentials.json` is in `src/config/`
- Verify the file contains valid OAuth credentials
- Re-download credentials from Google Cloud Console

### "Token expired" Error

- Delete `src/config/token.json`
- Run `node src/config/auth.js` to re-authenticate
- Update GitHub secrets with new base64-encoded token

### "Calendar API not enabled" Error

1. Go to Google Cloud Console
2. Navigate to APIs & Services > Library
3. Search for "Google Calendar API"
4. Click Enable

### GitHub Actions Failing

1. Check that secrets are properly set
2. Verify base64 encoding is correct (no newlines)
3. Check Actions logs for specific error messages

### Duplicate Events

If duplicates appear in your calendar:
1. Check `data.db` for existing entries
2. Clear the database if needed: `rm data.db`
3. Run sync again (will re-add all upcoming contests)

### No Contests Being Added

- Verify there are upcoming contests on Codeforces/AtCoder
- Check API responses in logs
- Ensure your calendar access is properly authorized

---

## License

This project is open source and available under the MIT License.

---

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Open an issue on GitHub
3. Include relevant error logs and configuration details
