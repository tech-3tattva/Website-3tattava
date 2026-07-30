#!/usr/bin/env node
"use strict";

/**
 * One-time Google authorization for VaidyaConnect Meet links.
 *
 * Run:  node scripts/authorize-google-calendar.js
 *
 * Reads GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET from backend/.env, opens a
 * consent flow, and prints the GOOGLE_CALENDAR_REFRESH_TOKEN to paste into .env.
 * The account you sign in with is the calendar that owns every consultation
 * event and sends the Meet invites (use a dedicated 3TATTAVA Google account).
 *
 * The OAuth client MUST allow the loopback redirect below. For a "Desktop app"
 * client this is automatic; for a "Web application" client, add
 *   http://localhost:53682
 * to its Authorized redirect URIs in Google Cloud Console.
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const http = require("http");
const { OAuth2Client } = require("google-auth-library");

const PORT = Number(process.env.OAUTH_PORT || 53682);
const REDIRECT_URI = `http://localhost:${PORT}`;
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in backend/.env");
  process.exit(1);
}

const oauth = new OAuth2Client(clientId, clientSecret, REDIRECT_URI);
const authUrl = oauth.generateAuthUrl({
  access_type: "offline",
  prompt: "consent", // force a refresh_token every run
  scope: SCOPES,
});

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, REDIRECT_URI);
  const code = u.searchParams.get("code");
  const err = u.searchParams.get("error");
  if (err) {
    res.end(`Authorization denied: ${err}. You can close this tab.`);
    console.error("Authorization denied:", err);
    server.close();
    return process.exit(1);
  }
  if (!code) {
    res.statusCode = 400;
    return res.end("No authorization code in the request.");
  }
  try {
    const { tokens } = await oauth.getToken(code);
    res.end("Authorized. Refresh token captured in your terminal — you can close this tab.");
    if (!tokens.refresh_token) {
      console.error(
        "\nNo refresh_token returned. Revoke prior access at " +
          "https://myaccount.google.com/permissions and run this again.\n"
      );
      server.close();
      return process.exit(1);
    }
    console.log("\n==================================================================");
    console.log("Paste this line into backend/.env (local) and the EC2 .env:\n");
    console.log(`GOOGLE_CALENDAR_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log("\n==================================================================\n");
    server.close();
    process.exit(0);
  } catch (e) {
    res.statusCode = 500;
    res.end(`Token exchange failed: ${e.message}`);
    console.error("Token exchange failed:", e.message);
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log("\n1) Open this URL in your browser (sign in with the 3TATTAVA Google account):\n");
  console.log(authUrl);
  console.log(`\n2) Grant access. Waiting for the redirect on ${REDIRECT_URI} ...\n`);
});
