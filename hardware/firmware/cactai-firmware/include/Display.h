#pragma once
#include <Arduino.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include "HealthScore.h"

// Everything shown on the sensor test screen
struct SensorReadings {
  int soilRaw;
  float moisture;
  float lux;              // -1 if the read failed
  long weightRaw;
  float grams;            // NAN if no reading yet
  bool buttonDown;
  bool buttonOn;
  uint32_t buttonPresses;
  float health;
};

class Display {
public:
  Display(uint8_t cs, uint8_t dc, uint8_t rst, uint8_t bl);

  void begin();
  void showDashboard(float moisture, float lux, float health);
  void showSensorTest(const SensorReadings& r);   // plain text, one row per sensor

private:
  void drawFace(Mood mood);
  void printRow(uint8_t row, uint16_t color, const char* text);

  Adafruit_ST7789 _tft;
  uint8_t _bl;
  int _lastMood = -1;   // -1 = nothing drawn yet
  bool _testTitleDrawn = false;
};