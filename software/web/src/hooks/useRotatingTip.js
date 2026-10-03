import { useState, useEffect } from 'react';

const TIP_INTERVAL_MS = 5 * 60 * 1000;
const STORAGE_KEY = 'cactai_last_tip_index';

function getLastIndex() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return -1;
    const n = parseInt(raw, 10);
    return isNaN(n) ? -1 : n;
  } catch {
    return -1;
  }
}

function saveLastIndex(idx) {
  try {
    localStorage.setItem(STORAGE_KEY, String(idx));
  } catch {
    // storage unavailable — no-op
  }
}

function pickNext(tips, lastIdx) {
  if (tips.length === 0) return -1;
  if (tips.length === 1) return 0;
  let idx;
  do {
    idx = Math.floor(Math.random() * tips.length);
  } while (idx === lastIdx);
  return idx;
}

export default function useRotatingTip(tips, intervalMs = TIP_INTERVAL_MS) {
  const [idx, setIdx] = useState(() => {
    const last = getLastIndex();
    const next = pickNext(tips, last);
    saveLastIndex(next);
    return next;
  });

  useEffect(() => {
    if (tips.length === 0) return;
    const id = setInterval(() => {
      setIdx(prev => {
        const next = pickNext(tips, prev);
        saveLastIndex(next);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [tips, intervalMs]);

  if (tips.length === 0 || idx < 0) return '';
  return tips[idx];
}
