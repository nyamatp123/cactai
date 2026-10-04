#include "MotorControl.h"

constexpr float WATER_DENSITY_G_PER_ML = 0.998f;  // at ~20 C

// Pump speed (percent). MIN_PWM must be enough to restart the pump from standstill; check by
// setting it in setup() and watching that water still moves.
constexpr uint8_t MAX_PWM = 100;
constexpr uint8_t MIN_PWM = 35;
constexpr float SLOW_ZONE_G = 5.0f;         // full speed until this many grams short of the target

// In-flight: how much more the scale reads after the pump stops. Learned after each dose.
constexpr float INITIAL_INFLIGHT_G = 3.0f;
constexpr float MAX_INFLIGHT_G = 20.0f;
constexpr float INFLIGHT_LEARN_RATE = 0.5f; // 0..1, how much of each dose's error is corrected

constexpr float FILTER_ALPHA = 0.3f;        // smoothing on the weight (lower = smoother but laggier)
constexpr uint8_t BASELINE_SAMPLES = 5;     // averaged for the starting weight (~0.5 s at 10 Hz)
constexpr uint32_t SETTLE_MS = 3000;        // wait after stopping before measuring the final weight

// Safety limits
constexpr uint32_t MAX_PUMP_MS = 120UL * 1000;  // pump never runs longer than this per dose
constexpr bool NO_FLOW_CHECK = false;          // off for bench testing without water on the scale
constexpr uint32_t NO_FLOW_MS = 8000;           // must gain NO_FLOW_MIN_G within this (includes priming the tube)
constexpr float NO_FLOW_MIN_G = 2.0f;
constexpr uint32_t SCALE_TIMEOUT_MS = 1000;     // no load cell reading for this long = scale fault
constexpr float DISTURBANCE_G = 20.0f;          // weight falling this far below the start aborts the dose
constexpr float SCALE_MAX_G = 950.0f;           // absolute reading limit, the load cell is 1 kg

MotorControl::MotorControl(Motor& motor)
  : _motor(motor), _inflightGrams(INITIAL_INFLIGHT_G) {}

bool MotorControl::start(float volumeMl) {
  if (isBusy()) {
    Serial.println("Pump: busy, request ignored");
    return false;
  }
  if (!isfinite(volumeMl) || volumeMl < MIN_VOLUME_ML || volumeMl > MAX_VOLUME_ML) {
    Serial.printf("Pump: volume %.1f ml out of range (%.0f-%.0f)\n", volumeMl, MIN_VOLUME_ML, MAX_VOLUME_ML);
    return false;
  }

  _targetGrams = volumeMl * WATER_DENSITY_G_PER_ML;
  _baselineSum = 0;
  _baselineCount = 0;
  _filteredGrams = NAN;
  _cutoffGrams = 0;
  _startMs = millis();
  _lastSampleMs = _startMs;
  _state = State::Baseline;
  Serial.printf("Pump: dose %.1f ml requested, reading starting weight\n", volumeMl);
  return true;
}

void MotorControl::cancel() {
  if (isBusy()) finish(Status::Cancelled);
}

void MotorControl::addSample(float grams) {
  if (!isBusy() || !isfinite(grams)) return;
  _lastSampleMs = millis();

  if (_state == State::Baseline) {
    _baselineSum += grams;
    if (++_baselineCount < BASELINE_SAMPLES) return;
    _baselineGrams = _baselineSum / _baselineCount;
    _filteredGrams = _baselineGrams;
    if (_baselineGrams + _targetGrams > SCALE_MAX_G) {
      Serial.printf("Pump: pot weighs %.0f g, adding %.0f g would overload the scale\n", _baselineGrams, _targetGrams);
      finish(Status::Overload);
      return;
    }
    startPumping();
    return;
  }

  _filteredGrams += FILTER_ALPHA * (grams - _filteredGrams);
  float delivered = deliveredGrams();

  if (_filteredGrams > SCALE_MAX_G) {
    finish(Status::Overload);
    return;
  }
  if (delivered < -DISTURBANCE_G) {
    finish(Status::Disturbed);
    return;
  }
  if (_state != State::Pumping) return;

  if (delivered >= _progressGrams + NO_FLOW_MIN_G) {
    _progressGrams = delivered;
    _progressMs = _lastSampleMs;
  }

  // Stop early by the in-flight amount, but never by more than half the dose
  float inflight = min(_inflightGrams, _targetGrams * 0.5f);
  float remaining = _targetGrams - delivered - inflight;
  if (remaining <= 0) {
    _cutoffGrams = delivered;
    stopPumping();
    _settleStartMs = millis();
    _state = State::Settling;
    Serial.printf("Pump: stopped at %.1f g, settling\n", delivered);
    return;
  }

  // Proportional taper: full speed until SLOW_ZONE_G short of the target, then down to MIN_PWM
  // at the stop point. Ending every dose at the same slow speed keeps the in-flight amount consistent.
  // If the in-flight amount is bigger than the slow zone, it just runs at full speed to the stop point.
  float slowSpan = SLOW_ZONE_G - inflight;  // grams between slowing down and stopping
  float pwm = slowSpan > 0 ? MIN_PWM + (MAX_PWM - MIN_PWM) * (remaining / slowSpan) : MAX_PWM;
  setPwm((uint8_t)constrain(pwm, (float)MIN_PWM, (float)MAX_PWM));
}

void MotorControl::update() {
  if (!isBusy()) return;
  uint32_t now = millis();

  if (now - _lastSampleMs > SCALE_TIMEOUT_MS) {
    finish(Status::ScaleError);
    return;
  }

  if (_state == State::Pumping) {
    if (now - _pumpStartMs > MAX_PUMP_MS) {
      finish(Status::Timeout);
    } else if (NO_FLOW_CHECK && now - _progressMs > NO_FLOW_MS) {
      finish(Status::NoFlow);
    }
    return;
  }

  if (_state == State::Settling && now - _settleStartMs >= SETTLE_MS) {
    // Learn from doses big enough to have reached the slow zone, so the cutoff speed matches
    if (_targetGrams >= SLOW_ZONE_G) {
      float measured = deliveredGrams() - _cutoffGrams;
      _inflightGrams += INFLIGHT_LEARN_RATE * (measured - _inflightGrams);
      _inflightGrams = constrain(_inflightGrams, 0.0f, MAX_INFLIGHT_G);
    }
    finish(Status::Ok);
  }
}

void MotorControl::startPumping() {
  _pumpStartMs = millis();
  _progressMs = _pumpStartMs;
  _progressGrams = 0;
  _state = State::Pumping;
  setPwm(MAX_PWM);
  Serial.printf("Pump: start weight %.1f g, pumping %.1f g (in-flight estimate %.1f g)\n",
                _baselineGrams, _targetGrams, _inflightGrams);
}

void MotorControl::stopPumping() {
  setPwm(0);
}

void MotorControl::finish(Status status) {
  stopPumping();
  _result.status = status;
  _result.targetMl = _targetGrams / WATER_DENSITY_G_PER_ML;
  _result.deliveredMl = deliveredMl();
  _result.durationMs = millis() - _startMs;
  _state = State::Idle;
  Serial.printf("Pump: %s, delivered %.1f / %.1f ml in %.1f s\n", statusName(status),
                _result.deliveredMl, _result.targetMl, _result.durationMs / 1000.0f);
}

void MotorControl::setPwm(uint8_t percent) {
  if (percent == _pwm) return;
  _pwm = percent;
  _motor.setPWM(percent);
}

float MotorControl::deliveredGrams() const {
  return isfinite(_filteredGrams) ? _filteredGrams - _baselineGrams : 0;
}

bool MotorControl::isBusy() const {
  return _state != State::Idle;
}

MotorControl::State MotorControl::state() const {
  return _state;
}

float MotorControl::deliveredMl() const {
  return deliveredGrams() / WATER_DENSITY_G_PER_ML;
}

const MotorControl::Result& MotorControl::lastResult() const {
  return _result;
}

float MotorControl::inflightGrams() const {
  return _inflightGrams;
}

const char* MotorControl::statusName(Status status) {
  switch (status) {
    case Status::None:       return "none";
    case Status::Ok:         return "ok";
    case Status::Cancelled:  return "cancelled";
    case Status::NoFlow:     return "no flow (reservoir empty or tube blocked?)";
    case Status::Timeout:    return "timeout";
    case Status::ScaleError: return "scale stopped responding";
    case Status::Disturbed:  return "weight dropped (pot moved?)";
    case Status::Overload:   return "scale overload";
  }
  return "unknown";
}
