// Account settings for the logged-in user. The backend uses snake_case;
// the settings pages use camelCase, so map between them here.
import { API_URL } from "./client";

async function request(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include", // send the auth cookie
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

function fromApi(u) {
  return {
    username: u.username,
    email: u.email,
    firstName: u.first_name ?? "",
    lastName: u.last_name ?? "",
    memberSince: u.created_at,
  };
}

export async function getAccount() {
  return fromApi(await request("/me"));
}

export async function updateAccount({ firstName, lastName, email }) {
  const user = await request("/me", {
    method: "PATCH",
    body: { first_name: firstName, last_name: lastName, email },
  });
  return fromApi(user);
}

export function changePassword(currentPassword, newPassword) {
  return request("/me/password", {
    method: "POST",
    body: { current_password: currentPassword, new_password: newPassword },
  });
}
