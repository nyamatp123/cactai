// Backend base URL, shared by every API module. /api is proxied to the backend
// by Vite (see vite.config.js), so cookies work. Set VITE_API_URL to override.
export const API_URL = import.meta.env.VITE_API_URL ?? "/api";
