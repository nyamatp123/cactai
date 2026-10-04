// src/theme.js
// Keeps the theme logic outside React so it works on every page, not just
// while the settings page is mounted.
// TODO: when the backend saves the theme, load it here instead of localStorage.

const STORAGE_KEY = "cactai-theme";
const THEMES = ["light", "dark", "system"];

export function getStoredTheme() {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return THEMES.includes(value) ? value : "light";
    } catch {
        return "light";
    }
}

// "system" resolves to whatever the OS is currently using
function resolveTheme(theme) {
    if (theme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
}

export function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", resolveTheme(theme));
}

// Call when the user picks a theme: remembers it and applies it right away
export function saveTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // storage unavailable (private mode etc.): the theme still applies for this session
    }
    applyTheme(theme);
}

let initialised = false;

// Call once at startup, before React renders
export function initTheme() {
    if (initialised) return;
    initialised = true;

    applyTheme(getStoredTheme());

    // Follow OS changes, but only while "Match system" is selected
    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
            if (getStoredTheme() === "system") applyTheme("system");
        });
}