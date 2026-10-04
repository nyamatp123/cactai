#include "LightSensor.h"

LightSensor::LightSensor(uint8_t addr) : _sensor(addr) {}

bool LightSensor::begin() {
  return _sensor.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
}

float LightSensor::readLux() {
  float lux = _sensor.readLightLevel();
  if (lux < 0) return -1;  // library returns a negative number on error
  return lux;
}