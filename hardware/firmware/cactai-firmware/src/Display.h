#pragma once
#include <Arduino.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include "HealthScore.h"

class Display {
public:
  Display(uint8_t cs, uint8_t dc, uint8_t rst, uint8_t bl);

  void begin();
  void showDashboard(float moisture, float lux, float health);

private:
  void drawFace(Mood mood);

  Adafruit_ST7789 _tft;
  uint8_t _bl;
  int _lastMood = -1;   // -1 = nothing drawn yet
};