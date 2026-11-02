/** Local calendar day as YYYY-MM-DD (the API's booking date format). */
export function todayISO() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/** Format an API booking date without timezone drift. */
export function formatBookingDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) {
    return value ?? "";
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** 9 -> "09:00", used in booking/time summaries. */
export function formatHour(hour) {
  return `${String(hour).padStart(2, "0")}:00`;
}
