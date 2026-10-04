#include <Arduino.h>
#include "motor.hpp"
#include "SoilSensor.h"

constexpr uint8_t MOTOR_PIN = 26;

constexpr uint32_t STEP_DELAY_MS = 20;

SoilSensor soil(32, 3318, 1870);  // pin, dryRaw, wetRaw

void setup() {
Serial.begin(115200);
soil.begin();
}

void loop() {
    // Constructed on first loop() call so pin setup happens after the Arduino core is initialized.
    // static Motor motor(MOTOR_PIN);

    // for (uint8_t pwm = 0; pwm <= 100; pwm++) {
    //     motor.setPWM(pwm);
    //     delay(STEP_DELAY_MS);
    // }
    // for (int pwm = 100; pwm >= 0; pwm--) {
    //     motor.setPWM(pwm);
    //     delay(STEP_DELAY_MS);
    // } Serial.println("hrgrjhgjh");

    Serial.print("raw: ");
    Serial.print(soil.readRaw());
    Serial.print("  moisture: ");
    Serial.print(soil.readPercent());
    Serial.println("%");
    delay(1000);
}
