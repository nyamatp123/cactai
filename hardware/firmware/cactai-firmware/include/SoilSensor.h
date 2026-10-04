#pragma once
#include <Arduino.h>

class SoilSensor {
public:
  SoilSensor(uint8_t pin, int dryRaw = 3000, int wetRaw = 1300);

  void begin();
  int readRaw();        // averaged raw ADC value (0-4095)
  float readPercent();  // 0-100, higher = wetter

private:
  uint8_t _pin;
  int _dryRaw;
  int _wetRaw;
};