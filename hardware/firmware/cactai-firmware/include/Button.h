#pragma once
#include <Arduino.h>

// Debounced push button that toggles an on/off state each time it's pressed.
// Call update() every loop(); it never blocks.
class Button {
public:
  // activeLow = true means the button connects the pin to GND (uses the internal pull-up)
  Button(uint8_t pin, uint32_t debounceMs = 50, bool activeLow = true);

  void begin();
  void update();

  bool isPressed() const;  // debounced: is the button held down right now?
  bool wasPressed();       // true once per press, then clears
  bool isOn() const;       // on/off state, flips on every press
  void setOn(bool on);

private:
  uint8_t _pin;
  uint32_t _debounceMs;
  bool _activeLow;

  bool _lastRaw = false;       // last raw reading, used to detect bouncing
  bool _stable = false;        // debounced pressed state
  uint32_t _lastChangeMs = 0;  // when the raw reading last changed
  bool _pressedEvent = false;
  bool _on = false;
};
