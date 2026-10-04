import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/auth";

// Asks the backend (/me) whether the auth cookie is valid.
// Returns "checking", "in" or "out".
export default function useAuthStatus() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    getCurrentUser()
      .then((user) => !cancelled && setStatus(user ? "in" : "out"))
      .catch(() => !cancelled && setStatus("out"));
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}