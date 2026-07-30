"use strict";

// --- Mocks -----------------------------------------------------------------
// OAuth2Client is instantiated inside getAccessToken(); capture the mock so we
// can assert credentials/token flow without touching the network.
const mockGetAccessToken = jest.fn().mockResolvedValue({ token: "ya29.test" });
const mockSetCredentials = jest.fn();
jest.mock("google-auth-library", () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    setCredentials: mockSetCredentials,
    getAccessToken: mockGetAccessToken,
  })),
}));

const { OAuth2Client } = require("google-auth-library");
const {
  isConfigured,
  createConsultationEvent,
  addMinutes,
  toRfc3339,
  DEFAULT_TZ,
} = require("../googleCalendar");

// Env keys the module reads (read fresh on every call — no resetModules needed).
const CRED_KEYS = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALENDAR_REFRESH_TOKEN",
  "GOOGLE_CALENDAR_ID",
  "CONSULT_TIMEZONE",
];

function setConfiguredEnv() {
  process.env.GOOGLE_CLIENT_ID = "client-id-123.apps.googleusercontent.com";
  process.env.GOOGLE_CLIENT_SECRET = "secret-abc";
  process.env.GOOGLE_CALENDAR_REFRESH_TOKEN = "1//refresh-token";
}

let consoleErrorSpy;
const savedEnv = {};

beforeEach(() => {
  // Snapshot then clear all creds so each test starts from a known baseline.
  for (const k of CRED_KEYS) {
    savedEnv[k] = process.env[k];
    delete process.env[k];
  }
  global.fetch = jest.fn();
  mockGetAccessToken.mockClear().mockResolvedValue({ token: "ya29.test" });
  mockSetCredentials.mockClear();
  OAuth2Client.mockClear();
  // The module logs via console.error on failure paths; keep test output clean.
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  for (const k of CRED_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
  consoleErrorSpy.mockRestore();
  delete global.fetch;
});

// --- Constants -------------------------------------------------------------
describe("DEFAULT_TZ", () => {
  it("is Asia/Kolkata", () => {
    expect(DEFAULT_TZ).toBe("Asia/Kolkata");
  });
});

// --- isConfigured ----------------------------------------------------------
describe("isConfigured", () => {
  it("is true only when all three creds are present, non-empty, non-placeholder", () => {
    setConfiguredEnv();
    expect(isConfigured()).toBe(true);
  });

  it("is false when any single cred is missing", () => {
    setConfiguredEnv();
    delete process.env.GOOGLE_CLIENT_ID;
    expect(isConfigured()).toBe(false);

    setConfiguredEnv();
    delete process.env.GOOGLE_CLIENT_SECRET;
    expect(isConfigured()).toBe(false);

    setConfiguredEnv();
    delete process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;
    expect(isConfigured()).toBe(false);
  });

  it("treats empty / whitespace-only values as absent", () => {
    setConfiguredEnv();
    process.env.GOOGLE_CLIENT_SECRET = "";
    expect(isConfigured()).toBe(false);

    setConfiguredEnv();
    process.env.GOOGLE_CLIENT_SECRET = "   ";
    expect(isConfigured()).toBe(false);
  });

  it("rejects placeholder-shaped values (placeholder / your- / xxxx, case-insensitive)", () => {
    for (const placeholder of [
      "placeholder",
      "PLACEHOLDER_VALUE",
      "your-client-id",
      "your_secret",
      "xxxx",
      "XXXX-token",
    ]) {
      setConfiguredEnv();
      process.env.GOOGLE_CALENDAR_REFRESH_TOKEN = placeholder;
      expect(isConfigured()).toBe(false);
    }
  });

  it("is false when the environment is empty", () => {
    expect(isConfigured()).toBe(false);
  });
});

// --- addMinutes ------------------------------------------------------------
describe("addMinutes", () => {
  it("adds minutes within the hour", () => {
    expect(addMinutes("10:00", 15)).toBe("10:15");
  });

  it("carries across the hour boundary", () => {
    expect(addMinutes("10:50", 20)).toBe("11:10");
  });

  it("zero-pads hours and minutes", () => {
    expect(addMinutes("09:05", 4)).toBe("09:09");
    expect(addMinutes("00:00", 5)).toBe("00:05");
  });

  it("clamps to 23:59 on same-day overflow", () => {
    expect(addMinutes("23:50", 30)).toBe("23:59");
    expect(addMinutes("23:59", 1)).toBe("23:59");
    expect(addMinutes("23:00", 120)).toBe("23:59");
  });
});

// --- toRfc3339 -------------------------------------------------------------
describe("toRfc3339", () => {
  it("appends the fixed +05:30 offset for Asia/Kolkata", () => {
    expect(toRfc3339("2026-08-01", "10:00", "Asia/Kolkata")).toBe(
      "2026-08-01T10:00:00+05:30"
    );
    expect(toRfc3339("2026-08-01", "10:00", DEFAULT_TZ)).toBe(
      "2026-08-01T10:00:00+05:30"
    );
  });

  it("returns a floating local time (no offset) for any other timezone", () => {
    expect(toRfc3339("2026-08-01", "10:00", "America/New_York")).toBe(
      "2026-08-01T10:00:00"
    );
    expect(toRfc3339("2026-08-01", "10:00", "UTC")).toBe(
      "2026-08-01T10:00:00"
    );
  });
});

// --- createConsultationEvent ----------------------------------------------
describe("createConsultationEvent", () => {
  const baseArgs = {
    summary: "Ayurveda consult",
    description: "Intake details, booking #42",
    date: "2026-08-01",
    startTime: "10:00",
    durationMin: 30,
    attendees: ["patient@example.com", "doctor@example.com"],
  };

  function okFetch(json) {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => json,
    });
  }

  it("returns null and makes NO network call when unconfigured", async () => {
    // env is cleared in beforeEach -> isConfigured() is false
    const result = await createConsultationEvent(baseArgs);
    expect(result).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(OAuth2Client).not.toHaveBeenCalled();
  });

  describe("when configured", () => {
    beforeEach(() => {
      setConfiguredEnv();
    });

    it("issues exactly one Calendar POST with the correct URL and Bearer token", async () => {
      okFetch({
        id: "evt1",
        hangoutLink: "https://meet.google.com/abc-defg-hij",
        htmlLink: "https://cal",
      });

      await createConsultationEvent(baseArgs);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = global.fetch.mock.calls[0];
      expect(url).toContain("/calendar/v3/calendars/primary/events");
      expect(url).toContain("conferenceDataVersion=1");
      expect(url).toContain("sendUpdates=all");
      expect(options.method).toBe("POST");
      expect(options.headers.Authorization).toBe("Bearer ya29.test");
      expect(options.headers["Content-Type"]).toBe("application/json");
    });

    it("passes the refresh token to OAuth2Client credentials", async () => {
      okFetch({ id: "e", hangoutLink: "https://meet.google.com/x", htmlLink: "h" });
      await createConsultationEvent(baseArgs);
      expect(mockSetCredentials).toHaveBeenCalledWith({
        refresh_token: "1//refresh-token",
      });
      expect(mockGetAccessToken).toHaveBeenCalledTimes(1);
    });

    it("builds a Google Meet conference create request in the body", async () => {
      okFetch({ id: "e", hangoutLink: "https://meet.google.com/x", htmlLink: "h" });
      await createConsultationEvent(baseArgs);

      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.conferenceData.createRequest.conferenceSolutionKey.type).toBe(
        "hangoutsMeet"
      );
      expect(typeof body.conferenceData.createRequest.requestId).toBe("string");
      expect(body.conferenceData.createRequest.requestId.length).toBeGreaterThan(0);
    });

    it("maps attendees to {email} objects, filtering placeholder/empty entries", async () => {
      okFetch({ id: "e", hangoutLink: "https://meet.google.com/x", htmlLink: "h" });
      await createConsultationEvent({
        ...baseArgs,
        attendees: [
          "patient@example.com",
          "  doctor@example.com  ",
          "",
          "   ",
          "your-email@placeholder.test",
          null,
          undefined,
        ],
      });

      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.attendees).toEqual([
        { email: "patient@example.com" },
        { email: "doctor@example.com" },
      ]);
    });

    it("sets start/end dateTime with end = start + durationMin (IST offset)", async () => {
      okFetch({ id: "e", hangoutLink: "https://meet.google.com/x", htmlLink: "h" });
      await createConsultationEvent({ ...baseArgs, startTime: "10:00", durationMin: 30 });

      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.start.dateTime).toBe("2026-08-01T10:00:00+05:30");
      expect(body.end.dateTime).toBe("2026-08-01T10:30:00+05:30");
      expect(body.start.timeZone).toBe("Asia/Kolkata");
      expect(body.end.timeZone).toBe("Asia/Kolkata");
    });

    it("url-encodes a non-default GOOGLE_CALENDAR_ID", async () => {
      process.env.GOOGLE_CALENDAR_ID = "team+cal@group.calendar.google.com";
      okFetch({ id: "e", hangoutLink: "https://meet.google.com/x", htmlLink: "h" });
      await createConsultationEvent(baseArgs);

      const url = global.fetch.mock.calls[0][0];
      expect(url).toContain(
        `/calendars/${encodeURIComponent("team+cal@group.calendar.google.com")}/events`
      );
    });

    it("returns {meetLink, eventId, htmlLink} from a successful response", async () => {
      okFetch({
        id: "evt1",
        hangoutLink: "https://meet.google.com/abc-defg-hij",
        htmlLink: "https://calendar.google.com/event?eid=evt1",
      });

      const result = await createConsultationEvent(baseArgs);
      expect(result).toEqual({
        meetLink: "https://meet.google.com/abc-defg-hij",
        eventId: "evt1",
        htmlLink: "https://calendar.google.com/event?eid=evt1",
      });
    });

    it("falls back to the video entryPoint uri when hangoutLink is missing", async () => {
      okFetch({
        id: "evt2",
        htmlLink: "https://cal",
        conferenceData: {
          entryPoints: [
            { entryPointType: "phone", uri: "tel:+1-555" },
            { entryPointType: "video", uri: "https://meet.google.com/fallback-uri" },
          ],
        },
      });

      const result = await createConsultationEvent(baseArgs);
      expect(result).toEqual({
        meetLink: "https://meet.google.com/fallback-uri",
        eventId: "evt2",
        htmlLink: "https://cal",
      });
    });

    it("returns null (no throw) when neither hangoutLink nor a video entryPoint exists", async () => {
      okFetch({ id: "evt3", htmlLink: "https://cal", conferenceData: { entryPoints: [] } });
      const result = await createConsultationEvent(baseArgs);
      expect(result).toBeNull();
    });

    it("returns null (no throw) on a non-ok fetch response", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 403,
        text: async () => "denied",
      });

      const result = await createConsultationEvent(baseArgs);
      expect(result).toBeNull();
    });

    it("returns null (no throw) when fetch rejects", async () => {
      global.fetch.mockRejectedValue(new Error("network down"));
      const result = await createConsultationEvent(baseArgs);
      expect(result).toBeNull();
    });

    it("defaults duration to 15 minutes when durationMin is falsy", async () => {
      okFetch({ id: "e", hangoutLink: "https://meet.google.com/x", htmlLink: "h" });
      await createConsultationEvent({ ...baseArgs, startTime: "09:00", durationMin: 0 });

      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.end.dateTime).toBe("2026-08-01T09:15:00+05:30");
    });

    it("honours CONSULT_TIMEZONE for a non-IST tz (floating dateTime, tz field set)", async () => {
      process.env.CONSULT_TIMEZONE = "America/New_York";
      okFetch({ id: "e", hangoutLink: "https://meet.google.com/x", htmlLink: "h" });
      await createConsultationEvent(baseArgs);

      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.start.dateTime).toBe("2026-08-01T10:00:00");
      expect(body.start.timeZone).toBe("America/New_York");
    });
  });
});
