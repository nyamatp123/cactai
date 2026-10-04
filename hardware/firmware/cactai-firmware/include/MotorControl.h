#pragma once
#include <Arduino.h>
#include "motor.hpp"

// Doses a set volume of water into the pot, using the load cell under the pot as feedback.
// Everything works on the weight change since the dose started, so the pot's own weight and
// the scale's tare don't matter.
//
// A dose goes through these phases (none of them block):
//   Baseline  pump off, average a few samples to get the starting weight
//   Pumping   full speed until SLOW_ZONE_G grams short of the target, then tapering to MIN_PWM.
//             Stops early by the "in-flight" amount: water still in the tube plus scale lag
//   Settling  pump off, wait for the reading to settle, then measure what actually went in
// After each good dose, the in-flight estimate is corrected using how far the final weight overshot,
// so the stopping point gets more accurate with use.
//
// Usage: addSample() for every new load cell reading, update() every loop(), start(ml) to water.
class MotorControl {
public:
  enum class State { Idle, Baseline, Pumping, Settling };

  enum class Status {
    None,        // no dose run yet
    Ok,
    Cancelled,   // cancel() was called
    NoFlow,      // pump on but weight isn't rising: reservoir empty, tube blocked or pump dead
    Timeout,     // took longer than MAX_PUMP_MS
    ScaleError,  // load cell stopped sending readings
    Disturbed,   // weight dropped a lot mid-dose (pot lifted?)
    Overload,    // scale near its maximum
  };

  struct Result {
    Status status;
    float targetMl;
    float deliveredMl;    // measured from the weight change
    uint32_t durationMs;  // from start() to finish
  };

  explicit MotorControl(Motor& motor);

  bool start(float volumeMl);        // false if busy or volume out of range
  void cancel();                     // stops the pump right away
  void addSample(float grams);       // call with every new load cell reading (absolute grams, NAN ignored)
  void update();                     // call every loop(); handles timeouts and the settle timer

  bool isBusy() const;               // true from start() until the result is ready
  State state() const;
  float deliveredMl() const;         // live estimate during a dose
  const Result& lastResult() const;
  float inflightGrams() const;       // current overshoot estimate, for debugging

  static const char* statusName(Status status);

  static constexpr float MIN_VOLUME_ML = 5.0f;
  static constexpr float MAX_VOLUME_ML = 500.0f;  // the load cell is 1 kg, pot included

private:
  void startPumping();
  void stopPumping();
  void finish(Status status);
  void setPwm(uint8_t percent);
  float deliveredGrams() const;

  Motor& _motor;
  State _state = State::Idle;
  Result _result = {Status::None, 0, 0, 0};

  float _targetGrams = 0;
  float _baselineGrams = 0;
  float _baselineSum = 0;
  uint8_t _baselineCount = 0;
  float _filteredGrams = NAN;        // smoothed absolute weight
  float _inflightGrams;              // learned overshoot after the pump stops
  float _cutoffGrams = 0;            // delivered weight at the moment the pump stopped

  uint8_t _pwm = 0;
  uint32_t _startMs = 0;
  uint32_t _pumpStartMs = 0;
  uint32_t _lastSampleMs = 0;
  uint32_t _settleStartMs = 0;
  float _progressGrams = 0;          // no-flow check: weight at the last progress mark
  uint32_t _progressMs = 0;
};
