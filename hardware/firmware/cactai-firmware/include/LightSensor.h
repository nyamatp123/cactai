#pragma once
#include <Arduino.h>
#include <BH1750.h>

class LightSensor {
public:
  LightSensor(uint8_t addr = 0x23);

  bool begin();
  float readLux();   // returns lux, or -1 if the read failed

private:
  BH1750 _sensor;
};