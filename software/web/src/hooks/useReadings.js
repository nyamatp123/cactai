import { useEffect, useState } from 'react';
import { getReadings, DATA_MODE } from '../api/readings';

const NO_ROWS = [];
const REFRESH_MS = 10_000;

// Loads readings for a plant + range, and outside "sample" mode refetches every
// REFRESH_MS while the tab is visible. State is only set from the promise
// callbacks; `loading` is derived by comparing the stored key to the current
// one, so only a plant/range change shows as loading. A refetch keeps the
// current rows on screen until the new ones arrive.
export default function useReadings({ plantId, plantType, range }) {
  const key = `${plantId}|${plantType}|${range}`;
  const [result, setResult] = useState({ key: null, data: null, error: null, updatedAt: null });

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;

    function load() {
      if (inFlight) return;
      inFlight = true;
      getReadings({ plantId, plantType, range })
        .then(
          (data) => {
            if (cancelled) return;
            // A hybrid fallback to the CSV (sensorError) isn't a successful sensor fetch
            setResult((prev) => ({
              key,
              data,
              error: null,
              updatedAt: !data.sensorError ? new Date() : prev.key === key ? prev.updatedAt : null,
            }));
          },
          (error) => {
            if (cancelled) return;
            // A failed refetch keeps the rows already showing; 401 always goes through
            setResult((prev) => (prev.key === key && prev.data && error.status !== 401
              ? prev
              : { key, data: null, error, updatedAt: null }));
          },
        )
        .finally(() => {
          inFlight = false;
        });
    }

    load();

    if (DATA_MODE === 'sample' || plantId == null) {
      return () => {
        cancelled = true;
      };
    }

    const timer = setInterval(() => {
      if (!document.hidden) load();
    }, REFRESH_MS);
    // Catch up straight away when the tab comes back
    function onVisibilityChange() {
      if (!document.hidden) load();
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [key, plantId, plantType, range]);

  const loading = result.key !== key;
  const data = loading ? null : result.data;
  return {
    rows: data?.rows ?? NO_ROWS,
    reason: data?.reason ?? null,
    lightUnit: data?.lightUnit ?? null,
    source: data?.source ?? null,
    hasLive: data?.hasLive ?? false,
    liveStartIndex: data?.liveStartIndex ?? -1,
    latest: data?.latest ?? null,
    sensorError: data?.sensorError ?? false,
    updatedAt: loading ? null : result.updatedAt,
    loading,
    error: loading ? null : result.error,
  };
}
