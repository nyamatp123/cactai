#include <Arduino.h>
#include "motor.hpp"
#include "SoilSensor.h"
#include "LightSensor.h"
#include "Display.h"
#include "LoadCell.h"
#include "Button.h"

// LCD (ST7789) uses hardware VSPI: MOSI = 23, CLK = 18
constexpr uint8_t LCD_CS_PIN  = 5;
constexpr uint8_t LCD_DC_PIN  = 16;
constexpr uint8_t LCD_RST_PIN = 17;
constexpr uint8_t LCD_BL_PIN  = 4;

constexpr uint8_t I2C_SDA_PIN = 21;  // BH1750
constexpr uint8_t I2C_SCL_PIN = 22;

constexpr uint8_t HX711_DOUT_PIN = 35;
constexpr uint8_t HX711_SCK_PIN  = 32;

constexpr uint8_t MOISTURE_PIN = 34;
constexpr uint8_t BUTTON_PIN   = 27;
constexpr uint8_t MOTOR_PIN    = 26;

constexpr uint32_t STEP_DELAY_MS = 20;

constexpr float HX711_CAL_FACTOR = 1.0f;  // counts per gram; replace with the value printed by the 'c' command

SoilSensor soil(MOISTURE_PIN, 3318, 1870);  // pin, dryRaw, wetRaw
LightSensor light;
Display screen(LCD_CS_PIN, LCD_DC_PIN, LCD_RST_PIN, LCD_BL_PIN);
LoadCell scale(HX711_DOUT_PIN, HX711_SCK_PIN, HX711_CAL_FACTOR);
Button button(BUTTON_PIN);

// Serial commands for the load cell test:
//   t        tare (remove everything from the scale first)
//   c<grams> calibrate with a known weight on the scale, e.g. "c200"
void handleScaleCommands() {
  if (!Serial.available()) return;

  char cmd = Serial.read();
  if (cmd == 't') {
    scale.tare();
    Serial.println("Tared.");
  } else if (cmd == 'c') {
    float knownGrams = Serial.parseFloat();
    if (knownGrams <= 0) {
      Serial.println("Usage: c<grams>, e.g. c200");
      return;
    }
    float factor = scale.calibrate(knownGrams);
    Serial.printf("Calibrated. HX711_CAL_FACTOR = %.4f\n", factor);
  }
}

void setup() {
Serial.begin(115200);
 Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);
 soil.begin();
 button.begin();


  if (!light.begin()) {
    Serial.println("BH1750 not found. Check wiring.");
  }
  screen.begin();

  if (!scale.begin()) {
    Serial.println("HX711 not found. Check wiring.");
  }
  Serial.println("Taring... keep the scale empty.");
  scale.tare();
  Serial.println("Ready. Commands: t = tare, c<grams> = calibrate (e.g. c200)");
}

void loop() {
    button.update();
    handleScaleCommands();

    long raw = scale.readRaw();
    float grams = scale.readGrams();
    if (isnan(grams)) {
      Serial.println("HX711 read failed.");
    } else {
      Serial.printf("raw: %ld  weight: %.1f g\n", raw, grams);
    }
    delay(200);

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

//   float moisture = soil.readPercent();
//   float lux = light.readLux();
//   float health = calcHealth(moisture, lux);

//   Serial.printf("moisture: %.1f%%  lux: %.0f  health: %.0f\n", moisture, lux, health);
//   screen.showDashboard(moisture, lux, health);

//   delay(1000);
}

