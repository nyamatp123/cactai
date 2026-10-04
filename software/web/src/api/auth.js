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
  } catch {
    throw new Error("Can't reach the server. Check that the backend is running.");
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

export async function signup({ username, email, password }) {
  await request("/users", { method: "POST", body: { username, email, password } });
  return login({ email, password });
}

export function logout() {
  return request("/logout", { method: "POST" });
}

export function isLoggedIn() {
    const token = getToken();
    if (!token) return false;
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        if (payload.exp * 1000 < Date.now()) {
            logout(); // token expired
            return false;
        }
        return true;
    } catch {
        logout(); // malformed token
        return false;
    }
}

// Use this for every call that needs a logged-in user
export async function authRequest(path, { method = "GET", body } = {}) {
    let res;
    try {
        res = await fetch(`${API_URL}${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new Error("Can't reach the server. Check that the backend is running.");
    }

    if (res.status === 401) {
        logout();
        window.location.assign("/login");
        throw new Error("Session expired. Please log in again.");
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const detail = Array.isArray(data.detail) ? data.detail[0]?.msg : data.detail;
        throw new Error(detail || `Request failed (${res.status})`);
    }
    return data;
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