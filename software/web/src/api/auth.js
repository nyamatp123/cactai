// Requests go to /api, which Vite proxies to the backend (see vite.config.js),
// so the browser treats frontend and backend as the same site and sends the cookie.
const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function request(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include", // send and receive the auth cookie
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error("Can't reach the server. Check that the backend is running.", { cause: err });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = Array.isArray(data.detail) ? data.detail[0]?.msg : data.detail;
    const err = new Error(detail || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export function login({ email, password }) {
  return request("/login", { method: "POST", body: { email, password } });
}

export async function signup({ firstName, lastName, username, email, password }) {
  await request("/users", {
    method: "POST",
    body: { first_name: firstName, last_name: lastName, username, email, password },
  });
  return login({ email, password });
}

export function logout() {
  return request("/logout", { method: "POST" });
}

// Returns the logged-in user, or null if the cookie is missing or expired.
export async function getCurrentUser() {
  try {
    return await request("/me");
  } catch (err) {
    if (err.status === 401) return null;
    throw err;
  }
}

// Async: the cookie is httpOnly, so only the backend can tell if it's valid.
export async function isLoggedIn() {
  return (await getCurrentUser()) !== null;
}

// Use this for every call that needs a logged-in user.
// Redirects to /login if the session is missing or expired.
export async function authRequest(path, options) {
  try {
    return await request(path, options);
  } catch (err) {
    if (err.status === 401) {
      window.location.assign("/login");
      throw new Error("Session expired. Please log in again.", { cause: err });
    }
    throw err;
  }
}