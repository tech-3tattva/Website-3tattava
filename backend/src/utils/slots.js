/**
 * Slot generation engine for the 3TATTAVA Doctor Booking system.
 *
 * Takes a doctor's working hours for a given day, subtracts booked and
 * blocked slots, and returns the remaining available time strings.
 */

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Generate available slots for a doctor on a specific date.
 *
 * @param {Object} doctor            — Doctor document (with workingHours, slotConfig)
 * @param {string} dateStr           — "YYYY-MM-DD"
 * @param {string[]} bookedSlots     — Already confirmed time strings ["10:00", "10:30"]
 * @param {string[]} blockedSlots    — Manually blocked time strings
 * @returns {{ available: string[], closed: boolean, reason?: string }}
 */
function generateSlots(doctor, dateStr, bookedSlots = [], blockedSlots = []) {
  const date = new Date(dateStr + "T00:00:00+05:30");
  const dayName = DAYS[date.getDay()];
  const dayConfig = doctor.workingHours?.[dayName];

  if (!dayConfig || dayConfig.closed) {
    return { available: [], closed: true, reason: `Doctor is not available on ${dayName}` };
  }

  const duration = doctor.slotConfig?.durationMinutes || 30;
  const buffer = doctor.slotConfig?.bufferMinutes || 0;
  const step = duration + buffer;

  const openMin = timeToMinutes(dayConfig.from);
  const closeMin = timeToMinutes(dayConfig.to);
  const breakFrom = dayConfig.breakFrom ? timeToMinutes(dayConfig.breakFrom) : null;
  const breakTo = dayConfig.breakTo ? timeToMinutes(dayConfig.breakTo) : null;

  const bookedSet = new Set(bookedSlots);
  const blockedSet = new Set(blockedSlots);

  // Current time in IST for "no slots in the past" logic.
  const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const todayStr = nowIST.toISOString().slice(0, 10);
  const isToday = dateStr === todayStr;
  // Minimum 2 hours from now.
  const minBookableMin = isToday
    ? nowIST.getUTCHours() * 60 + nowIST.getUTCMinutes() + 120
    : 0;

  const slots = [];
  for (let m = openMin; m + duration <= closeMin; m += step) {
    // Skip break window.
    if (breakFrom !== null && breakTo !== null) {
      if (m >= breakFrom && m < breakTo) continue;
      if (m < breakFrom && m + duration > breakFrom) continue;
    }

    const timeStr = minutesToTime(m);

    if (isToday && m < minBookableMin) continue;
    if (bookedSet.has(timeStr)) continue;
    if (blockedSet.has(timeStr)) continue;

    slots.push(timeStr);
  }

  return { available: slots, closed: false };
}

/**
 * Generate a human-readable booking ID.
 * Format: 3T-YYYYMMDD-XXXX (random 4-digit suffix).
 */
function generateBookingId(dateStr) {
  const datePart = dateStr.replace(/-/g, "");
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `3T-${datePart}-${rand}`;
}

/**
 * Compute the end time for a slot given duration.
 */
function getEndTime(startTime, durationMinutes = 30) {
  return minutesToTime(timeToMinutes(startTime) + durationMinutes);
}

module.exports = { generateSlots, generateBookingId, getEndTime, DAYS };
