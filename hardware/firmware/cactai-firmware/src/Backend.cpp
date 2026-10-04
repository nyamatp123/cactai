#include "Backend.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Set to 1 to build and print the JSON every interval without connecting to WiFi or sending it
#define DRY_RUN 0

constexpr uint32_t UPLOAD_INTERVAL_MS      = 60UL * 1000;  // wait after a successful upload
constexpr uint32_t UPLOAD_RETRY_MS         = 30UL * 1000;  // wait after a failed upload (or while WiFi is down)
constexpr uint32_t WIFI_CONNECT_TIMEOUT_MS = 10UL * 1000;  // how long begin() waits for WiFi before moving on
constexpr int32_t  HTTP_CONNECT_TIMEOUT_MS = 5000;         // TCP connect to the server
constexpr uint16_t HTTP_TIMEOUT_MS         = 8000;         // waiting for the server's response

// A reading counts as failed if it's NaN/inf or negative (BH1750 gives -1, HX711 gives NAN)
static bool validReading(float value) {
  return isfinite(value) && value >= 0;
}

// JSON has no NaN, so failed readings are sent as null. Valid ones are rounded to 1 decimal.
static void setReading(JsonDocument& doc, const char* key, float value, bool valid) {
  if (valid) doc[key] = serialized(String(value, 1));
  else       doc[key] = nullptr;
}

static const char* httpHint(int status) {
  switch (status) {
    case 201: return "stored";
    case 401: return "device key mismatch (check DEVICE_KEY in secrets.h)";
    case 404: return "MAC not paired to a plant";
    case 422: return "payload field names or types wrong";
  }
  if (status < 0) return "can't reach server, check IP and network";
  return "unexpected response";
}

static const char* wifiHint(wl_status_t status) {
  switch (status) {
    case WL_NO_SSID_AVAIL:  return "SSID not found (the ESP32 only sees 2.4 GHz networks)";
    case WL_CONNECT_FAILED: return "connect failed (wrong password?)";
    default:                return "still trying";
  }
}

Backend::Backend(const char* ssid, const char* password, const char* baseUrl, const char* deviceKey)
  : _ssid(ssid), _password(password), _deviceKey(deviceKey), _readingsUrl(baseUrl) {
  // BACKEND_URL is the base URL; tolerate a trailing slash or "/readings" already on the end
  if (_readingsUrl.endsWith("/")) _readingsUrl.remove(_readingsUrl.length() - 1);
  if (!_readingsUrl.endsWith("/readings")) _readingsUrl += "/readings";

  _serverHost = _readingsUrl;
  int scheme = _serverHost.indexOf("://");
  if (scheme >= 0) _serverHost.remove(0, scheme + 3);
  int path = _serverHost.indexOf('/');
  if (path >= 0) _serverHost.remove(path);
}

void Backend::begin() {
  WiFi.mode(WIFI_STA);
  _deviceId = WiFi.macAddress();  // only valid once WiFi.mode() has started the radio

  Serial.println("---- Backend self-check ----");
  Serial.printf("MAC (device_id): %s\n", _deviceId.c_str());
  Serial.printf("Server: %s (POST %s)\n", _serverHost.c_str(), _readingsUrl.c_str());
  if (_serverHost.startsWith("localhost") || _serverHost.startsWith("127.")) {
    Serial.println("WARNING: BACKEND_URL points at localhost, which is the ESP32 itself. Use your computer's LAN IP.");
  }

  if (DRY_RUN) {
    Serial.println("DRY_RUN on: WiFi not started, JSON is printed but never sent");
    Serial.println("----------------------------");
    return;
  }

  Serial.printf("WiFi: connecting to \"%s\"...\n", _ssid);
  WiFi.setAutoReconnect(true);
  WiFi.begin(_ssid, _password);

  uint32_t start = millis();
  while (!isConnected() && millis() - start < WIFI_CONNECT_TIMEOUT_MS) {
    delay(100);
  }

  if (isConnected()) {
    _wasConnected = true;
    printConnectionInfo();
  } else {
    wl_status_t status = WiFi.status();
    Serial.printf("WiFi: not connected after %lus (status %d: %s), retrying in the background\n",
                  (unsigned long)(WIFI_CONNECT_TIMEOUT_MS / 1000), (int)status, wifiHint(status));
  }
  Serial.println("----------------------------");
}

bool Backend::isConnected() {
  return WiFi.status() == WL_CONNECTED;
}

void Backend::printConnectionInfo() {
  Serial.printf("WiFi: connected to \"%s\", IP %s, server %s\n",
                _ssid, WiFi.localIP().toString().c_str(), _serverHost.c_str());
}

void Backend::checkWifi() {
  bool connected = isConnected();
  if (connected == _wasConnected) return;
  _wasConnected = connected;

  if (connected) {
    printConnectionInfo();
    _nextUploadMs = millis();  // send straight away after (re)connecting
  } else {
    Serial.println("WiFi: connection lost, reconnecting...");
    WiFi.reconnect();
    _nextUploadMs = millis() + UPLOAD_RETRY_MS;  // next reconnect nudge; reconnecting resets this
  }
}

void Backend::update(const SensorReadings& r) {
  if (!DRY_RUN) checkWifi();

  // Signed compare so this keeps working when millis() wraps after ~49 days
  if ((int32_t)(millis() - _nextUploadMs) < 0) return;

  if (!DRY_RUN && !isConnected()) {
    WiFi.reconnect();  // nudge it in case auto-reconnect gave up (e.g. after an auth failure)
    _nextUploadMs = millis() + UPLOAD_RETRY_MS;
    return;
  }

  String body;
  if (!buildJson(r, body)) {
    _nextUploadMs = millis() + UPLOAD_RETRY_MS;
    return;
  }
  Serial.printf("Backend: JSON %s\n", body.c_str());

  if (DRY_RUN) {
    Serial.println("Backend: DRY_RUN, not sent");
    _nextUploadMs = millis() + UPLOAD_INTERVAL_MS;
    return;
  }

  bool sent = post(body);
  _nextUploadMs = millis() + (sent ? UPLOAD_INTERVAL_MS : UPLOAD_RETRY_MS);
}

bool Backend::buildJson(const SensorReadings& r, String& out) {
  bool luxOk = validReading(r.lux);

  JsonDocument doc;
  doc["device_id"] = _deviceId;
  setReading(doc, "moisture_pct", r.moisture, validReading(r.moisture));
  doc["soil_raw"] = r.soilRaw;
  setReading(doc, "lux", r.lux, luxOk);
  setReading(doc, "weight_g", r.grams, validReading(r.grams));
  // calcHealth() still returns a number when the light sensor fails, so drop it here
  setReading(doc, "health_score", r.health, luxOk && validReading(r.health));

  if (doc.overflowed() || serializeJson(doc, out) == 0) {
    Serial.println("Backend: failed to build JSON, upload skipped");
    return false;
  }
  return true;
}

bool Backend::post(const String& body) {
  HTTPClient http;
  if (!http.begin(_readingsUrl)) {
    Serial.printf("Backend: bad BACKEND_URL \"%s\"\n", _readingsUrl.c_str());
    return false;
  }
  http.setConnectTimeout(HTTP_CONNECT_TIMEOUT_MS);
  http.setTimeout(HTTP_TIMEOUT_MS);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Device-Key", _deviceKey);

  int status = http.POST(body);
  String response = (status > 0 && status != 201) ? http.getString() : String();
  http.end();

  Serial.printf("Backend: POST -> %d %s\n", status, httpHint(status));
  if (status < 0) {
    Serial.printf("Backend:   %s\n", HTTPClient::errorToString(status).c_str());
  } else if (status != 201) {
    Serial.printf("Backend:   response: %s\n", response.c_str());
  }
  return status == 201;
}

const String& Backend::deviceId() {
  return _deviceId;
}
