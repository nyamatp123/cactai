#include "Button.h"

Button::Button(uint8_t pin, uint32_t debounceMs, bool activeLow)
  : _pin(pin), _debounceMs(debounceMs), _activeLow(activeLow) {}

void Button::begin() {
  pinMode(_pin, _activeLow ? INPUT_PULLUP : INPUT_PULLDOWN);
  _lastRaw = (digitalRead(_pin) == LOW) == _activeLow;
  _stable = _lastRaw;
  _lastChangeMs = millis();
}

void Button::update() {
  bool raw = (digitalRead(_pin) == LOW) == _activeLow;

  // Any change restarts the timer, so contact bounce never gets through
  if (raw != _lastRaw) {
    _lastRaw = raw;
    _lastChangeMs = millis();
  }

  // Only accept the new state once it's held steady for the debounce time
  if (raw != _stable && millis() - _lastChangeMs >= _debounceMs) {
    _stable = raw;
    if (_stable) {         // flip on press, not on release
      _pressedEvent = true;
      _on = !_on;
    }
  }
}

bool Button::isPressed() const {
  return _stable;
}

bool Button::wasPressed() {
  bool pressed = _pressedEvent;
  _pressedEvent = false;
  return pressed;
}

bool Button::isOn() const {
  return _on;
}

void Button::setOn(bool on) {
  _on = on;
}
