#pragma once

// Copy this file to secrets.h (which is gitignored) and fill in your values.

// ESP32 only supports 2.4 GHz WiFi networks
#define WIFI_SSID     "your-wifi-name"
#define WIFI_PASSWORD "your-wifi-password"

// Your computer's LAN IP (run `ipconfig` and use the IPv4 address), not localhost.
// The backend must be started with --host 0.0.0.0 to be reachable from the ESP32.
#define BACKEND_URL   "http://192.168.1.100:8000"
