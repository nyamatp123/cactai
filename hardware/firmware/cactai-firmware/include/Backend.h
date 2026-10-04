#pragma once
#include <Arduino.h>
#include "Display.h"

// Connects to WiFi and POSTs sensor readings as JSON to the CactAI backend.
// The board is identified by its WiFi MAC address.
class Backend {
public:
  Backend(const char* ssid, const char* password, const char* baseUrl);

  void begin();                                 // starts WiFi without blocking; reconnects on its own
  bool isConnected();
  bool sendReadings(const SensorReadings& r);   // true if the backend stored them
  const String& deviceId();                     // e.g. "AA:BB:CC:DD:EE:FF"

private:
  const char* _ssid;
  const char* _password;
  String _readingsUrl;
  String _deviceId;
};
