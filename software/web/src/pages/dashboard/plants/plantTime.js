// the purpose of this file is to give a human readable time since the plant was acquired, given an amount and unit of time
export function acquiredDateFrom(amount, unit) {
  const d = new Date();
  if (unit === "days") d.setDate(d.getDate() - amount);
  if (unit === "weeks") d.setDate(d.getDate() - amount * 7);
  if (unit === "months") d.setMonth(d.getMonth() - amount);
  if (unit === "years") d.setFullYear(d.getFullYear() - amount);
  return d.toISOString();
}

// Rough inverse of acquiredDateFrom, used to prefill the edit form
export function durationFrom(iso) {
  if (!iso) return { amount: "3", unit: "months" };
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso)) / 86400000));
  if (days < 14) return { amount: String(days), unit: "days" };
  if (days < 60) return { amount: String(Math.round(days / 7)), unit: "weeks" };
  if (days < 730) return { amount: String(Math.round(days / 30.4)), unit: "months" };
  return { amount: String(Math.floor(days / 365)), unit: "years" };
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
