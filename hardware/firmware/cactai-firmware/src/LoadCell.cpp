#include "LoadCell.h"

static const unsigned long READY_TIMEOUT_MS = 1000;

LoadCell::LoadCell(uint8_t doutPin, uint8_t sckPin, float calFactor)
  : _doutPin(doutPin), _sckPin(sckPin), _calFactor(calFactor) {}

bool LoadCell::begin() {
  _scale.begin(_doutPin, _sckPin);  // channel A, gain 128
  _scale.set_scale(_calFactor);
  return waitReady();
}

// The library's read functions block forever if the HX711 is unplugged,
// so check it's ready (with a timeout) before every read.
bool LoadCell::isReady() {
  return _scale.is_ready();
}

bool LoadCell::waitReady() {
  return _scale.wait_ready_timeout(READY_TIMEOUT_MS);
}

void LoadCell::tare(uint8_t samples) {
  if (!waitReady()) return;
  _scale.tare(samples);
}

long LoadCell::readRaw(uint8_t samples) {
  if (!waitReady()) return 0;
  return _scale.read_average(samples);
}

float LoadCell::readGrams(uint8_t samples) {
  if (!waitReady()) return NAN;
  return _scale.get_units(samples);  // (raw - tare offset) / calFactor
}

float LoadCell::rawToGrams(long raw) {
  return (raw - _scale.get_offset()) / _calFactor;
}

float LoadCell::calibrate(float knownGrams, uint8_t samples) {
  if (knownGrams <= 0 || !waitReady()) return _calFactor;
  float counts = _scale.get_value(samples);  // raw - tare offset
  setCalFactor(counts / knownGrams);
  return _calFactor;
}

void LoadCell::setCalFactor(float calFactor) {
  _calFactor = calFactor;
  _scale.set_scale(calFactor);
}

float LoadCell::getCalFactor() {
  return _calFactor;
}
