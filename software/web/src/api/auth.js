import { API_URL } from "./client";

const TOKEN_KEY = "cactai_token";

async function request(path, body) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Can't reach the server. Check that the backend is running.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // FastAPI returns a string for HTTPException, an array for validation errors
    const detail = Array.isArray(data.detail) ? data.detail[0]?.msg : data.detail;
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return data;
}

export async function login({ email, password }) {
  const data = await request("/login", { email, password });
  localStorage.setItem(TOKEN_KEY, data.access_token);
  return data;
}

export async function signup({ username, email, password }) {
  await request("/users", { username, email, password });
  return login({ email, password });
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}