#pragma once
#include <Arduino.h>
#include <HX711.h>

// HX711 amplifier + 1kg load cell.
// calFactor = raw counts per gram. Find it with calibrate() and hardcode the result.
class LoadCell {
public:
  LoadCell(uint8_t doutPin, uint8_t sckPin, float calFactor = 1.0f);

  bool begin();                              // false if the HX711 doesn't respond
  void tare(uint8_t samples = 20);           // zero the scale (call with nothing on it)
  long readRaw(uint8_t samples = 10);        // averaged raw ADC counts, tare not removed
  float readGrams(uint8_t samples = 10);     // weight in grams, or NAN if the read failed
  float calibrate(float knownGrams, uint8_t samples = 20);  // known weight on scale -> new calFactor

  void setCalFactor(float calFactor);
  float getCalFactor();

private:
  bool waitReady();

  HX711 _scale;
  uint8_t _doutPin;
  uint8_t _sckPin;
  float _calFactor;
};
