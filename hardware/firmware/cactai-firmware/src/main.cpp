#include <Arduino.h>
#include "motor.hpp"
#include "SoilSensor.h"
#include "LightSensor.h"
#include "Display.h"

constexpr uint8_t MOTOR_PIN = 26;

constexpr uint32_t STEP_DELAY_MS = 20;

SoilSensor soil(32, 3318, 1870);  // pin, dryRaw, wetRaw
LightSensor light;
Display screen(5, 16, 17, 4); 

void setup() {
Serial.begin(115200);
 Wire.begin(21, 22);
 soil.begin();


  if (!light.begin()) {
    Serial.println("BH1750 not found. Check wiring.");
  }
  screen.begin();
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

    // Serial.print("raw: ");
    // Serial.print(soil.readRaw());
    // Serial.print("  moisture: ");
    // Serial.print(soil.readPercent());
    // Serial.println("%");
    // delay(1000);

    // Serial.print("moisture: ");
    // Serial.print(soil.readPercent());
    // Serial.print("%   lux: ");
    // Serial.println(light.readLux());
    // delay(1000);

//      float moisture = soil.readPercent();
//   float lux = light.readLux();
//   float health = calcHealth(moisture, lux);

//   Serial.printf("moisture: %.1f%%  lux: %.0f  health: %.0f\n", moisture, lux, health);
//   screen.showDashboard(moisture, lux, health);

//   delay(1000);
}
