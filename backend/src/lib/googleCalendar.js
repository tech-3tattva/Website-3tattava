"use strict";

/**
 * Google Calendar + Google Meet integration for VaidyaConnect consultations.
 *
 * Creates a Calendar event with a unique Google Meet link and invites both the
 * patient and the doctor (Google emails each a calendar invite carrying the Meet
 * link, and the slot lands on the doctor's Google Calendar).
 *
 * Env-gated: if any credential is missing/placeholder, isConfigured() is false
 * and createConsultationEvent() returns null, so the caller falls back to the
 * legacy meet link + SES emails. Never throws to the request path.
 *
 * Required env vars (set after a one-time authorize — see
 * scripts/authorize-google-calendar.js):
 *   GOOGLE_CLIENT_ID              — OAuth client id (Desktop or Web app)
 *   GOOGLE_CLIENT_SECRET          — OAuth client secret
 *   GOOGLE_CALENDAR_REFRESH_TOKEN — refresh token for the calendar owner account
 * Optional:
 *   GOOGLE_CALENDAR_ID            — target calendar (default "primary")
 *   CONSULT_TIMEZONE              — IANA tz for slot times (default "Asia/Kolkata")
 */

const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const DEFAULT_TZ = "Asia/Kolkata";
// Asia/Kolkata is a fixed +05:30 offset (India observes no DST), so we can build
// unambiguous RFC-3339 timestamps without a tz database.
const IST_OFFSET = "+05:30";

/** A value is usable only if present, non-empty, and not a template placeholder. */
function isPresent(value) {
  if (!value) return false;
  const v = String(value).trim();
  if (!v) return false;
  if (/placeholder|your[-_]|xxxx/i.test(v)) return false;
  return true;
}

/** True when all OAuth credentials needed to talk to the Calendar API are set. */
function isConfigured() {
  return (
    isPresent(process.env.GOOGLE_CLIENT_ID) &&
    isPresent(process.env.GOOGLE_CLIENT_SECRET) &&
    isPresent(process.env.GOOGLE_CALENDAR_REFRESH_TOKEN)
  );
}

/** Add `minutes` to an "HH:MM" string, returning "HH:MM" (clamped to same day). */
function addMinutes(hhmm, minutes) {
  const [h, m] = String(hhmm).split(":").map(Number);
  const total = Math.min(h * 60 + m + minutes, 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/**
 * Build an RFC-3339 dateTime for a date + time in the consult timezone.
 * We only support the fixed-offset IST default; any other tz is passed through
 * as a floating local time with the `timeZone` field doing the interpreting.
 */
function toRfc3339(dateStr, hhmm, tz) {
  if (tz === DEFAULT_TZ) return `${dateStr}T${hhmm}:00${IST_OFFSET}`;
  return `${dateStr}T${hhmm}:00`; // let Calendar interpret via the timeZone field
}

/** Return a short-lived access token from the stored refresh token. */
async function getAccessToken() {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  client.setCredentials({ refresh_token: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN });
  const { token } = await client.getAccessToken();
  if (!token) throw new Error("Google returned no access token");
  return token;
}

/**
 * Create a consultation Calendar event with a Google Meet link and invite the
 * given attendees. Returns { meetLink, eventId, htmlLink } or null when the
 * integration is unconfigured or the API call fails (caller falls back).
 *
 * @param {Object}   p
 * @param {string}   p.summary       — event title
 * @param {string}   p.description   — event body (intake details, booking id)
 * @param {string}   p.date          — "YYYY-MM-DD"
 * @param {string}   p.startTime     — "HH:MM"
 * @param {number}   p.durationMin   — slot length in minutes
 * @param {string[]} p.attendees     — attendee email addresses
 * @param {string}   [p.timeZone]    — IANA tz (default CONSULT_TIMEZONE/Asia/Kolkata)
 */
async function createConsultationEvent({ summary, description, date, startTime, durationMin, attendees }) {
  if (!isConfigured()) return null;
  try {
    const tz = (process.env.CONSULT_TIMEZONE || DEFAULT_TZ).trim() || DEFAULT_TZ;
    const calendarId = encodeURIComponent((process.env.GOOGLE_CALENDAR_ID || "primary").trim() || "primary");
    const endTime = addMinutes(startTime, durationMin || 15);

    const body = {
      summary,
      description,
      start: { dateTime: toRfc3339(date, startTime, tz), timeZone: tz },
      end: { dateTime: toRfc3339(date, endTime, tz), timeZone: tz },
      attendees: (attendees || [])
        .filter((e) => isPresent(e))
        .map((email) => ({ email: String(email).trim() })),
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: { useDefault: true },
    };

    const token = await getAccessToken();
    const url =
      `${CALENDAR_API}/calendars/${calendarId}/events` +
      `?conferenceDataVersion=1&sendUpdates=all`;

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Calendar API ${res.status}: ${detail.slice(0, 300)}`);
    }

    const data = await res.json();
    const meetLink =
      data.hangoutLink ||
      data.conferenceData?.entryPoints?.find((p) => p.entryPointType === "video")?.uri ||
      null;

    if (!meetLink) throw new Error("Calendar event created but no Meet link returned");
    return { meetLink, eventId: data.id, htmlLink: data.htmlLink };
  } catch (err) {
    // Never break the booking flow — log and let the caller fall back.
    // eslint-disable-next-line no-console
    console.error("[googleCalendar] event creation failed:", err.message);
    return null;
  }
}

module.exports = { isConfigured, createConsultationEvent, addMinutes, toRfc3339, DEFAULT_TZ };
