#pragma once
#include <Arduino.h>
#include "Display.h"

// Connects to WiFi and POSTs sensor readings as JSON to the CactAI backend.
// The board is identified by its WiFi MAC address.
class Backend {
public:
  Backend(const char* ssid, const char* password, const char* baseUrl, const char* deviceKey);

  void begin();                                 // starts WiFi (waits up to WIFI_CONNECT_TIMEOUT_MS) and prints a self-check
  void update(const SensorReadings& r);         // call often from loop(); keeps WiFi up and uploads on schedule
  bool isConnected();
  const String& deviceId();                     // e.g. "AA:BB:CC:DD:EE:FF"

private:
  void checkWifi();                             // logs connect / drop once per change
  void printConnectionInfo();
  bool buildJson(const SensorReadings& r, String& out);
  bool post(const String& body);                // true if the backend stored the reading (201)

  const char* _ssid;
  const char* _password;
  const char* _deviceKey;
  String _readingsUrl;
  String _serverHost;                           // host:port, for logging
  String _deviceId;
  bool _wasConnected = false;
  uint32_t _nextUploadMs = 0;                   // first upload goes out as soon as WiFi connects
};
