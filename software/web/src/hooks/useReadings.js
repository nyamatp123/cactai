import { useEffect, useState } from 'react';
import { getReadings } from '../api/readings';

const NO_ROWS = [];

// Loads readings for a plant + range. State is only set from the promise
// callbacks; `loading` is derived by comparing the stored key to the current one.
export default function useReadings({ plantId, plantType, range }) {
  const key = `${plantId}|${plantType}|${range}`;
  const [result, setResult] = useState({ key: null, data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    getReadings({ plantId, plantType, range }).then(
      (data) => {
        if (!cancelled) setResult({ key, data, error: null });
      },
      (error) => {
        if (!cancelled) setResult({ key, data: null, error });
      },
    );
    return () => {
      cancelled = true;
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
    loading,
    error: loading ? null : result.error,
  };
}
