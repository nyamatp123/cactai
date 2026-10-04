#include "Backend.h"
#include <WiFi.h>
#include <HTTPClient.h>

constexpr uint16_t HTTP_TIMEOUT_MS = 5000;

// JSON has no NaN, so invalid readings are sent as null
static String jsonFloat(float value, bool valid) {
  return valid ? String(value, 1) : String("null");
}

Backend::Backend(const char* ssid, const char* password, const char* baseUrl)
  : _ssid(ssid), _password(password), _readingsUrl(String(baseUrl) + "/readings") {}

void Backend::begin() {
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(_ssid, _password);
  _deviceId = WiFi.macAddress();
  Serial.printf("WiFi: connecting to \"%s\" as %s\n", _ssid, _deviceId.c_str());
}

bool Backend::isConnected() {
  return WiFi.status() == WL_CONNECTED;
}

bool Backend::sendReadings(const SensorReadings& r) {
  if (!isConnected()) return false;

  String body = "{";
  body += "\"device_id\":\"" + _deviceId + "\"";
  body += ",\"moisture\":" + jsonFloat(r.moisture, !isnan(r.moisture));
  body += ",\"soil_raw\":" + String(r.soilRaw);
  body += ",\"lux\":" + jsonFloat(r.lux, r.lux >= 0);
  body += ",\"weight_g\":" + jsonFloat(r.grams, !isnan(r.grams));
  body += ",\"weight_raw\":" + String(r.weightRaw);
  body += ",\"health\":" + jsonFloat(r.health, !isnan(r.health));
  body += "}";

  HTTPClient http;
  http.setConnectTimeout(HTTP_TIMEOUT_MS);
  http.setTimeout(HTTP_TIMEOUT_MS);
  http.begin(_readingsUrl);
  http.addHeader("Content-Type", "application/json");
  int status = http.POST(body);
  http.end();

  if (status == 201) {
    Serial.printf("Backend: readings sent (IP %s)\n", WiFi.localIP().toString().c_str());
    return true;
  }
  // Negative status = couldn't reach the server (wrong IP, firewall, backend not running)
  Serial.printf("Backend: POST %s failed (%d %s)\n", _readingsUrl.c_str(), status,
                status < 0 ? HTTPClient::errorToString(status).c_str() : "");
  return false;
}

const String& Backend::deviceId() {
  return _deviceId;
}
