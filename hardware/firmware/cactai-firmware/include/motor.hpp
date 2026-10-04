#pragma once

#include <Arduino.h>

// Single-direction motor driven by a low-side MOSFET on a PWM pin.
class Motor {
public:
    explicit Motor(uint8_t pwmPin);

    // Sets duty cycle as a percentage (0-100). Values above 100 clamp to 100.
    void setPWM(uint8_t percent);

private:
    static constexpr uint8_t PWM_CHANNEL = 0;
    static constexpr uint32_t PWM_FREQ_HZ = 8000;
    static constexpr uint8_t PWM_RESOLUTION_BITS = 10;
    static constexpr uint32_t PWM_MAX_DUTY = (1 << PWM_RESOLUTION_BITS) - 1;

    uint8_t pwmPin_;
};
