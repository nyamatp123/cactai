#include <Arduino.h>
#include "motor.hpp"

constexpr uint8_t MOTOR_PIN = 26;
constexpr uint32_t STEP_DELAY_MS = 20;

void setup() {
}

void loop() {
    // Constructed on first loop() call so pin setup happens after the Arduino core is initialized.
    static Motor motor(MOTOR_PIN);

    for (uint8_t pwm = 0; pwm <= 100; pwm++) {
        motor.setPWM(pwm);
        delay(STEP_DELAY_MS);
    }
    for (int pwm = 100; pwm >= 0; pwm--) {
        motor.setPWM(pwm);
        delay(STEP_DELAY_MS);
    }
}
