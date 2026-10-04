#include "SoilSensor.h"

SoilSensor::SoilSensor(uint8_t pin, int dryRaw, int wetRaw)
  : _pin(pin), _dryRaw(dryRaw), _wetRaw(wetRaw) {}

void SoilSensor::begin() {
  pinMode(_pin, INPUT);
  analogReadResolution(12);  // 12-bit readings: 0 to 4095
}

int SoilSensor::readRaw() {
  long sum = 0;
  const int samples = 10;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(_pin);
    delay(5);
  }
  return sum / samples;  // average of 10 readings smooths out noise
}

float SoilSensor::readPercent() {
  int raw = readRaw();
  float pct = (float)(_dryRaw - raw) / (_dryRaw - _wetRaw) * 100.0;
  return constrain(pct, 0.0, 100.0);
}