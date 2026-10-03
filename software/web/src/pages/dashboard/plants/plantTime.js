// the purpose of this file is to give a human readable time since the plant was acquired, given an amount and unit of time
export function acquiredDateFrom(amount, unit) {
  const d = new Date();
  if (unit === "days") d.setDate(d.getDate() - amount);
  if (unit === "weeks") d.setDate(d.getDate() - amount * 7);
  if (unit === "months") d.setMonth(d.getMonth() - amount);
  if (unit === "years") d.setFullYear(d.getFullYear() - amount);
  return d.toISOString();
}

export function timeWithYou(iso) {
  if (!iso) return "";
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (days < 1) return "just got it";
  if (days < 14) return `with you for ${days} day${days === 1 ? "" : "s"}`;
  if (days < 60) return `with you for ${Math.round(days / 7)} weeks`;
  if (days < 730) {
    const m = Math.round(days / 30.4);
    return `with you for ${m} month${m === 1 ? "" : "s"}`;
  }
  return `with you for ${Math.floor(days / 365)} years`;
}
